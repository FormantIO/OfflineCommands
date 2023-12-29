from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from formant_provider import FormantProvider

formant_provider = FormantProvider()

print("Setting up FastAPI")

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/commands")
async def get_commands():
    print("Recieved /commands request.")
    return [x.to_dict() for x in formant_provider.getCommands()]


print("FastAPI setup")
