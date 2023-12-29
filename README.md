# OfflineCommands
A lightweight application to send configured commands to a robot in an offline environment

## Components
This project contains two main components. The Server, which should be run on the same device as the agent, and the Frontend.
### Server
The Server should be run on the same device as the agent, and needs access to both the agent's `/var/lib/formant` and the internet.
The server serves the Frontend the list of configured commands for the agent it has access to.

### Frontend
The Frontend will let you send commands, returned by the server, to an agent.
The Frontend will automatically try to connect to the agent and server on localhost, however it is possible to reset it and manually input an IP address for the device to connect to. 

## Running the Components
### Server
#### Environment file
The server is configured with a `.env`
```
export FORMANT_EMAIL=# email of admin service account
export FORMANT_PASSWORD=# password of admin service account
export SERVER_PORT=80
```
**If changing the port used, change the port the frontend connects to on: `/frontend/app/src/main.ts#L5`**
```
# First build the server
docker build -t command_server .
# Then run it, it needs access to /var/lib/formant and expects an .env file 
docker run --name commands_server --network host -v ${PWD}/.env:/code/app/.env -v /var/lib/formant:/var/lib/formant command_server
```

### Frontend
```
# First, build the project
docker build -t local_command_ui .
# Then run it, It needs access to port 5502 to communicate to the agent and the port the server is running on 
docker run --name local_command_ui --network host local_command_ui
```

The UI should be running at port 9144 by default, you can check the docker logs to confirm this