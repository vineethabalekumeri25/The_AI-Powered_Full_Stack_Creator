"""
Step 10: Task 2 - Ollama API Integration
This module provides a Python interface for interacting with Ollama's local LLM API.
"""

import requests
import json
from typing import Optional, Dict, Any


class OllamaClient:
    """Client for interacting with Ollama's local LLM API"""
    
    def __init__(self, base_url: str = "http://localhost:11434"):
        """
        Initialize Ollama client
        
        Args:
            base_url: Base URL for Ollama API (default: http://localhost:11434)
        """
        self.base_url = base_url
        self.api_url = f"{base_url}/api/generate"
        self.chat_url = f"{base_url}/api/chat"
    
    def generate(
        self,
        model: str,
        prompt: str,
        stream: bool = False,
        options: Optional[Dict[str, Any]] = None
    ) -> str:
        """
        Generate text completion using Ollama
        
        Args:
            model: Model name (e.g., "llama3", "mistral", "phi")
            prompt: Text prompt for generation
            stream: Whether to stream the response
            options: Additional generation options (temperature, top_p, etc.)
        
        Returns:
            Generated text response
        """
        payload = {
            "model": model,
            "prompt": prompt,
            "stream": False,
            "format": "json" if options and options.get("format") == "json" else ""
        }
        
        # Remove format from options if it exists
        if options:
            options_copy = options.copy()
            options_copy.pop("format", None)
            if options_copy:
                payload["options"] = options_copy
        
        try:
            response = requests.post(
                self.api_url,
                json=payload,
                timeout=120,
                headers={"Content-Type": "application/json"}
            )
            
            # Print debug info
            print(f"Request URL: {self.api_url}")
            print(f"Request payload: {json.dumps(payload, indent=2)}")
            print(f"Response status: {response.status_code}")
            print(f"Response text: {response.text[:200]}...")
            
            response.raise_for_status()
            
            # Parse the response - Ollama returns JSON with "response" field
            data = response.json()
            return data.get("response", "")
        
        except requests.exceptions.ConnectionError:
            raise Exception(
                "Cannot connect to Ollama. Make sure Ollama is running.\n"
                "Start Ollama with: ollama serve"
            )
        except requests.exceptions.HTTPError as e:
            raise Exception(
                f"Ollama API error: {e}\n"
                f"Response: {response.text}\n"
                f"Make sure model '{model}' is installed: ollama pull {model}"
            )
        except requests.exceptions.RequestException as e:
            raise Exception(f"Ollama API error: {str(e)}")
    
    def chat(
        self,
        model: str,
        messages: list,
        stream: bool = False
    ) -> str:
        """
        Chat with Ollama using conversation history
        
        Args:
            model: Model name
            messages: List of message dicts with "role" and "content"
            stream: Whether to stream the response
        
        Returns:
            Generated chat response
        """
        payload = {
            "model": model,
            "messages": messages,
            "stream": stream
        }
        
        try:
            response = requests.post(
                self.chat_url,
                json=payload,
                timeout=60
            )
            response.raise_for_status()
            
            data = response.json()
            return data["message"]["content"]
        
        except Exception as e:
            raise Exception(f"Ollama chat error: {str(e)}")
    
    def list_models(self) -> list:
        """
        List all available models in Ollama
        
        Returns:
            List of model names
        """
        try:
            response = requests.get(f"{self.base_url}/api/tags")
            response.raise_for_status()
            data = response.json()
            return [model["name"] for model in data.get("models", [])]
        except Exception as e:
            raise Exception(f"Failed to list models: {str(e)}")
    
    def is_available(self) -> bool:
        """
        Check if Ollama is running and accessible
        
        Returns:
            True if Ollama is available, False otherwise
        """
        try:
            response = requests.get(f"{self.base_url}/api/tags", timeout=5)
            return response.status_code == 200
        except:
            return False


def generate_journal_prompt(theme: str, model: str = "llama3.2:1b") -> str:
    """
    Creative Exercise: Generate a creative journaling prompt based on a theme
    
    Args:
        theme: Theme for the journal prompt (e.g., "Inspired by BLACKPINK")
        model: Ollama model to use (default: "llama3.2:1b" - lightweight, 1.3GB)
    
    Returns:
        Generated journal prompt
    """
    client = OllamaClient()
    
    # Check if Ollama is available
    if not client.is_available():
        raise Exception(
            "Ollama is not running. Please start Ollama with 'ollama serve' "
            "and ensure you have a model installed with 'ollama pull llama3.2:1b'"
        )
    
    prompt = f"""You are a creative writing assistant for a fashion journal.
Write one inspiring journal prompt about: "{theme}"

Make it 2-3 sentences that encourage self-reflection about fashion and personal style."""
    
    # Generate the journal prompt
    journal_prompt = client.generate(
        model=model,  # This correctly uses the parameter
        prompt=prompt,
        options={
            "temperature": 0.8,
            "top_p": 0.9
        }
    )
    
    return journal_prompt.strip()


# Test the client
if __name__ == "__main__":
    print("Testing Ollama Client...")
    
    client = OllamaClient()
    
    # Check if Ollama is available
    if not client.is_available():
        print("❌ Ollama is not running!")
        print("Please start Ollama with: ollama serve")
        print("And install a model with: ollama pull llama3.2:1b")
        exit(1)
    
    print("✅ Ollama is running")
    
    # List available models
    try:
        models = client.list_models()
        print(f"\nAvailable models: {', '.join(models)}")
    except Exception as e:
        print(f"Error listing models: {e}")
    
    # Test journal prompt generation
    print("\nGenerating journal prompt...")
    theme = "Inspired by BLACKPINK"
    
    try:
        prompt = generate_journal_prompt(theme, model="llama3.2:1b")
        print(f"\nTheme: {theme}")
        print(f"Generated Prompt:\n{prompt}")
    except Exception as e:
        print(f"Error: {e}")