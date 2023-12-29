import { Fleet, PeerDevice } from "@formant/data-sdk";
import "./style.css";

let device: PeerDevice | undefined;
const port = 80;

function appendLog(msg: string) {
    console.log(msg);
    el("#log").innerHTML += "<br>" + msg;
}

function clearLog() {
    console.log("Clearing log.");
    el("#log").innerHTML = "";
}

function setLog(msg: string) {
    console.log(msg);
    el("#log").innerHTML = msg;
}

function el(selector: string) {
    return document.querySelector(selector) as HTMLElement;
}

function reset() {
    el("#command_body").hidden = true;
    el("#connect_div").hidden = false;
    setLog(`Not connected.`);
    device = undefined;
}

async function connect(deviceDescriptor: string) {
    clearLog();
    try {
        appendLog("Connecting to device...");
        device = await Fleet.getPeerDevice(`http://${deviceDescriptor}:5502`);
        appendLog("Connected to device.");
    } catch (e: any) {
        appendLog(e.toString());
        appendLog(
            `Failed to connect to agent at: "${deviceDescriptor}". Is it running and the IP correct?`
        );
        return;
    }
    let commands;
    try {
        appendLog("Connecting to web server...");
        const response = await fetch(`http://${deviceDescriptor}:${port}/commands`);
        commands = await response.json();
        appendLog("Connected to web server.");
    } catch (e: any) {
        appendLog(e.toString());
        appendLog(
            `Failed to connect to web server at: "${deviceDescriptor}:${port}". Is it running?`
        );
        return;
    }
    appendLog("Recieved commands.");
    try {
        appendLog("Setting command list...");
        el("#commands").innerHTML = commands
            .map((_: any) => `<option value=${_.command}>${_.name}</option>`)
            .join(", ");
        el("#command_body").hidden = false;
        el("#connect_div").hidden = true;
    } catch (e: any) {
        appendLog(e.toString());
        return;
    }

    setLog(`Connected to device at: ${deviceDescriptor}`);
}

(async function init() {
    await connect("localhost");
})();

el("#connect").addEventListener("click", async () => {
    const deviceDescriptor = (el("#device_ip") as HTMLInputElement).value;
    await connect(deviceDescriptor);
});

el("#reset").addEventListener("click", reset);

el("#send_command").addEventListener("click", async () => {
    try {
        if (!device) {
            appendLog("Not connected to a device, please reset and reconnect.");
            return;
        }
        const command = (el("#commands") as HTMLInputElement).value;
        const payload = (el("#command_payload") as HTMLInputElement).value;
        await device.sendCommand(command, payload);
        setLog(`Command "${command}:${payload}" sent!`);
    } catch (e: any) {
        appendLog(e.toString());
        return;
    }
    (el("#command_payload") as HTMLInputElement).value = "";
});

document.body.style.display = "block";
