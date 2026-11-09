from typing import Dict, List
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import json

router = APIRouter(tags=["Realtime KDS"])


class KDSConnectionManager:
    def __init__(self):
        # Maps outlet_id -> list of active WebSockets
        self.active_connections: Dict[int, List[WebSocket]] = {}

    async def connect(self, outlet_id: int, websocket: WebSocket):
        await websocket.accept()
        if outlet_id not in self.active_connections:
            self.active_connections[outlet_id] = []
        self.active_connections[outlet_id].append(websocket)
        print(f"🔌 KDS Station WebSocket connected for outlet_id={outlet_id} (Total: {len(self.active_connections[outlet_id])})")

    def disconnect(self, outlet_id: int, websocket: WebSocket):
        if outlet_id in self.active_connections:
            if websocket in self.active_connections[outlet_id]:
                self.active_connections[outlet_id].remove(websocket)
            if not self.active_connections[outlet_id]:
                del self.active_connections[outlet_id]
        print(f"🔌 KDS Station WebSocket disconnected for outlet_id={outlet_id}")

    async def broadcast_to_outlet(self, outlet_id: int, message: dict):
        """Broadcast message to all kitchen displays subscribed to this outlet."""
        if outlet_id in self.active_connections:
            payload = json.dumps(message)
            for connection in self.active_connections[outlet_id]:
                try:
                    await connection.send_text(payload)
                except Exception as e:
                    print(f"⚠️ Error broadcasting to KDS client: {e}")

    async def broadcast_to_all(self, message: dict):
        """Broadcast to all connected kitchen screens and admins."""
        payload = json.dumps(message)
        for outlet_id, sockets in self.active_connections.items():
            for connection in sockets:
                try:
                    await connection.send_text(payload)
                except Exception:
                    pass


kds_manager = KDSConnectionManager()


@router.websocket("/ws/kds/{outlet_id}")
async def websocket_kds_endpoint(websocket: WebSocket, outlet_id: int):
    await kds_manager.connect(outlet_id, websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Respond to heartbeat or ping
            if data == "ping":
                await websocket.send_text("pong")
    except WebSocketDisconnect:
        kds_manager.disconnect(outlet_id, websocket)
    except Exception as e:
        print(f"KDS WebSocket exception: {e}")
        kds_manager.disconnect(outlet_id, websocket)

