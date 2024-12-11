For running install flask in a new environment and comment out 
the import in unstructured_pdf and the function content. Just
add `text = "bla bla bla" and return it`
# LangChain Agents Project

This project contains implementations of various AI agents using the LangChain framework. Each agent is designed for a specific task and can be individually tested and deployed. 

## Table of Contents
- [Getting Started](#getting-started)
- [Folder Structure](#folder-structure)
- [Agents Overview](#agents-overview)
- [Installation](#installation)
- [Testing](#testing)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

To use or contribute to this project, follow the steps below:

1. Clone the repository:
   ```bash
   git clone <repository_url>
   ```
2. Navigate to the project directory:
   ```bash
   cd langchain-agents-project
   ```
3. Install the dependencies (see [Installation](#installation)).

## Folder Structure

```
langchain-agents-project/
│
├── agents/          # Agent implementations
│   ├── agent1.py    # Example agent 1
│   ├── agent2.py    # Example agent 2
│   └── ...          # Additional agents
│
├── tests/           # Unit and integration tests
│   ├── test_agent1.py
│   ├── test_agent2.py
│   └── ...
│
├── requirements.txt # Project dependencies
├── README.md        # Project documentation
└── debug_agent.py   # Quick debugging script for agents
```

## Agents Overview

- **Agent1**: Handles task X using `ToolA` and LangChain's Zero-Shot-React-Description agent.
- **Agent2**: Performs task Y using `ToolB` with custom logic.

Refer to the individual agent files in the `agents/` folder for more details.

## Installation

1. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate   # On Windows, use `venv\Scripts\activate`
   ```

2. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Testing

Unit tests for individual agents are located in the `tests/` folder.

Run the tests using `pytest`:
```bash
pytest tests/
```

Or with `unittest`:
```bash
python -m unittest discover tests/
```

## Usage

To test an individual agent:
1. Modify the debugging script (`debug_agent.py`) to use the desired agent.
2. Run the script:
   ```bash
   python debug_agent.py
   ```

### Example

Using `Agent1` to process input:
```python
from agents.agent1 import Agent1

agent = Agent1()
response = agent.run("Sample input")
print(response)
```

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes and push the branch:
   ```bash
   git add .
   git commit -m "Add feature-name"
   git push origin feature-name
   ```
4. Create a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
