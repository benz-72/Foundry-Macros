# Foundry VTT Item Transfer Macro

This document provides instructions on how to install and use the Item Transfer Macro for Foundry Virtual Tabletop. This macro allows users to easily transfer items between tokens within a scene.

## Installation

Follow these steps to install the Item Transfer Macro in Foundry VTT:

1.  **Open Foundry VTT.**
2.  **Navigate to the Macro Directory:** This is typically found in the sidebar under "Macros".
3.  **Click "Create Macro".**
4.  **Name the macro:** For example, "Item Transfer" or "Token Item Transfer".
5.  **Set the macro type to "Script".** This is crucial as the macro content is JavaScript code (once adapted).
6.  **Copy the macro script content:**
    *   The current `transfer_ui.py` in this repository is a Python script using Tkinter for its UI and mock data for demonstration purposes. It is **not** directly usable in Foundry VTT's JavaScript environment.
    *   For actual Foundry VTT use, this Python script would need to be translated into JavaScript, using Foundry VTT's API for UI elements (e.g., Dialogs), actor/token access, and item management.
    *   Once you have the JavaScript version of the macro, copy its entire content.
7.  **Paste the script content into the macro editor field in Foundry VTT.**
8.  **Click "Save Macro".**

**Important Note on Current Script (`transfer_ui.py`):**

The `transfer_ui.py` file included in this project is a standalone Python application that serves as a **functional prototype**. It demonstrates the intended UI flow and core logic for the item transfer functionality.

Key characteristics of this prototype:
*   **Python and Tkinter:** It is written in Python and uses the Tkinter library for its graphical user interface (UI).
*   **Mock Data:** It operates using mock (simulated) data for actors, items, and inventories, primarily through a structure referred to as `MOCK_ACTORS_DB` within the script. This means it does not interact with any live Foundry VTT game data.

**For actual use in Foundry Virtual Tabletop, the script would need to be:**
1.  **Rewritten in JavaScript:** Foundry VTT macros are executed as JavaScript.
2.  **Adapted to Foundry VTT API:** It must use Foundry VTT's Application Programming Interface (API) to:
    *   Access real actor data, item details, and token information from your game world.
    *   Perform operations on actor inventories.
3.  **Utilize Foundry VTT UI Elements:** Instead of Tkinter, it would use Foundry VTT's own UI components (such as the `Dialog` class or other HTML-based forms) to create the user interface.

Therefore, the Python script itself cannot be directly installed or run as a Foundry VTT macro. It is a design and logic demonstration to guide the development of an equivalent JavaScript-based macro.

## Usage

Once the Item Transfer Macro (JavaScript version) is installed in Foundry VTT, follow these steps to use it:

1.  **Launch the Macro:**
    *   Click the macro button in your Macro Hotbar if you've dragged it there.
    *   Alternatively, find the macro in the Macro Directory and click "Execute".

2.  **Interact with the Macro UI:**
    A dialog window will appear. The UI elements described below are based on the Python prototype (`transfer_ui.py`). A native Foundry VTT macro would have a similar interface, though its appearance might differ.

    *   **Select Giver Token:**
        *   In the Python prototype, a "Select Giver" button opens a dialog to choose from controlled tokens.
        *   In a Foundry VTT macro, this would typically involve selecting your controlled token on the scene (if it's the giver) or using a target selection prompt. The macro should identify the token from which items will be taken.

    *   **Select Receiver Token:**
        *   The Python prototype uses a dropdown menu listing all available tokens.
        *   A Foundry VTT macro would likely use a target selection tool (e.g., click on the target token on the scene) or a dropdown populated with tokens from the current scene.

    *   **Item Name:**
        *   Enter the exact name of the item you wish to transfer as it appears in the Giver's inventory. Misspellings will likely result in the item not being found.

    *   **Quantity:**
        *   Input the numerical quantity of the item to transfer (e.g., `1`, `5`, `10`).

3.  **Perform the Transfer:**
    *   After filling in all fields, click the "Transfer" button (or a similarly named button in the Foundry macro UI).
    *   The macro will then attempt the transfer. You should see a confirmation message (like a chat message) if successful, or an error message if something went wrong (e.g., item not found, insufficient quantity).

**Note on UI:** The user interface and exact method for selecting tokens in a live Foundry VTT macro will depend on its specific JavaScript implementation and the Foundry VTT API capabilities used. The description above outlines the general functionality as demonstrated in the `transfer_ui.py` Python prototype.

## Error Messages and Troubleshooting

You might encounter the following error messages when using the Item Transfer Macro. These are based on the logic in the `transfer_ui.py` prototype; a JavaScript version for Foundry VTT would have similar checks:

*   **"Giver token not selected."**
    *   *Meaning:* You have not selected or targeted a token to give items from.
    *   *Action:* Ensure you have a token selected or targeted that will act as the giver.

*   **"Receiver token not selected."**
    *   *Meaning:* You have not selected or targeted a token to receive items.
    *   *Action:* Ensure you have a token selected or targeted that will act as the receiver.

*   **"Giver and Receiver tokens cannot be the same."**
    *   *Meaning:* The token selected to give items is the same as the token selected to receive items.
    *   *Action:* Select two different tokens for the transfer.

*   **"Item Name cannot be empty."**
    *   *Meaning:* You have not entered a name for the item to be transferred.
    *   *Action:* Type the exact name of the item in the "Item Name" field.

*   **"Quantity must be a positive integer."**
    *   *Meaning:* The quantity entered is not a valid number (e.g., it's zero, negative, or text).
    *   *Action:* Enter a whole number greater than zero for the quantity.

*   **"Item '[Item Name]' not found in Giver's inventory."** (e.g., "Item 'Health Potion' not found in Giver's inventory.")
    *   *Meaning:* The item name you entered does not exist in the inventory of the giving token, or it's misspelled.
    *   *Action:* Double-check the spelling of the item name. Ensure the giver token actually possesses that item. Item names are often case-sensitive.

*   **"Giver does not have enough '[Item Name]' (Available: X, Requested: Y)."** (e.g., "Giver does not have enough 'Arrows' (Available: 10, Requested: 20).")
    *   *Meaning:* The giving token has the item, but not in the quantity you're trying to transfer.
    *   *Action:* Reduce the quantity to transfer, or ensure the giver has enough of the item.

*   **"Actor not found for Giver/Receiver token."**
    *   *Meaning:* (More applicable to a live Foundry macro) The system could not find a valid actor associated with one of the selected tokens. This might indicate a corrupted token or a bug in the macro if token selection wasn't handled correctly.
    *   *Action:* Try re-selecting the tokens. If the problem persists with specific tokens, there might be an issue with those tokens themselves.

**Basic Troubleshooting Tips:**

*   **Token Selection:** Always ensure you have clearly selected or targeted both a giver and a receiver token according to how the Foundry VTT version of the macro handles selections.
*   **Item Names:** Item names usually need to be exact, including capitalization and any special characters. Check for typos.
*   **Inventory Check:** Before attempting a transfer, you can manually open the giver's character sheet to verify they have the item and the desired quantity.
*   **Macro Installation:** If the macro doesn't run at all or throws unexpected errors immediately:
    *   Ensure you copied the entire JavaScript macro code correctly.
    *   Verify the macro type is set to "Script" in Foundry VTT, not "Chat".
*   **Foundry VTT Console:** For more advanced troubleshooting (especially with a JavaScript macro), you can open the Foundry VTT console (usually by pressing F12) to look for more detailed error messages that might point to specific issues in the script.
