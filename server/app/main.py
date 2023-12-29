from server import app
import uvicorn
import os

if __name__ == "__main__":
    print("Starting server.")
    port = int(os.getenv("SERVER_PORT", "80"))
    print("Starting server with port: %s" % port)
    uvicorn.run(app, host="localhost", port=port)
