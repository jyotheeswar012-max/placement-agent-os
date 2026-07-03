from datetime import datetime
from typing import Any, Dict

def format_response(data: Any, message: str = "Success", status: str = "ok") -> Dict:
    return {
        "status": status,
        "message": message,
        "data": data,
        "timestamp": datetime.utcnow().isoformat()
    }

def paginate(items: list, page: int, limit: int) -> Dict:
    total = len(items)
    start = (page - 1) * limit
    end = start + limit
    return {
        "items": items[start:end],
        "total": total,
        "page": page,
        "limit": limit,
        "pages": (total + limit - 1) // limit
    }
