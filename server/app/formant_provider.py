from threading import Thread
from typing import List, Dict
import time
from formant.sdk.cloud.v2 import Client as CloudClient
from formant.sdk.agent.v1 import Client as AgentClient
from formant.sdk.cloud.v2.formant_admin_api_client.api.command_template import (
    command_template_controller_list,
)
from formant.sdk.cloud.v2.formant_admin_api_client.models.command_template import (
    CommandTemplate,
)


class FormantProvider(Thread):
    def __init__(self):
        self._formant_cloud_client = CloudClient()
        self._formant_agent_client = AgentClient()
        Thread.__init__(self)
        self.daemon = True
        print("Starting Formant Provider.")
        self.start()

    def run(self):
        while True:
            self.refresh()
            time.sleep(5)

    def refresh(self):
        try:
            self.cloud_commands = self.get_cloud_commands()
            self.agentTags = self.getAgentTags()
        except Exception as e:
            print("Error refreshing: %s" % str(e))

    def getAgentTags(self):
        try:
            return self._formant_agent_client.get_agent_configuration().document.tags
        except AttributeError:
            return {}

    def get_cloud_commands(self):
        response = command_template_controller_list.sync_detailed(
            client=self._formant_cloud_client.admin.get_client().with_timeout(100)
        )
        return [item for item in response.parsed.items if item.enabled is True]

    def getCommands(self):
        return self.filter_commands_by_tags(self.cloud_commands, self.agentTags)

    def filter_commands_by_tags(self, commands: List[CommandTemplate], tags: Dict):
        if len(tags.items()) == 0:
            return commands
        result = []
        for command in commands:
            all_match = True
            command_tags = command.tags.to_dict()
            for c_key in command_tags.keys():
                if command_tags[c_key] != tags[c_key]:
                    all_match = False
                    break
            if all_match:
                result.append(command)

        return result
