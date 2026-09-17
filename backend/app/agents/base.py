from abc import ABC, abstractmethod

class BaseAgent(ABC):
    name: str = "base-agent"

    @abstractmethod
    async def run(self, *args, **kwargs):
        """Execute the agent."""
        raise NotImplementedError