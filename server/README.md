# To build and run
```
docker build -t command_server .
docker run --name commands_server --network host -v ${PWD}/.env:/code/app/.env -v /var/lib/formant:/var/lib/formant command_server
```
