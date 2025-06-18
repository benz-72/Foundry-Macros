import tkinter as tk
from tkinter import ttk, messagebox

# Mock Classes for Actors and Inventory
class Item:
    def __init__(self, name, quantity):
        self.name = name
        self.quantity = quantity

    def __repr__(self):
        return f"Item(name='{self.name}', quantity={self.quantity})"

class Actor:
    def __init__(self, name, token_id):
        self.name = name
        self.token_id = token_id # This would be the unique ID for the token
        self.inventory = [] # List of Item objects

    def find_item(self, item_name):
        for item in self.inventory:
            if item.name.lower() == item_name.lower():
                return item
        return None

    def add_item(self, item_name, quantity):
        item = self.find_item(item_name)
        if item:
            item.quantity += quantity
        else:
            self.inventory.append(Item(item_name, quantity))
        print(f"Added {quantity} of '{item_name}' to {self.name}. New inventory: {self.inventory}")


    def remove_item(self, item_name, quantity):
        item = self.find_item(item_name)
        if not item:
            return False, f"Item '{item_name}' not found in {self.name}'s inventory."
        if item.quantity < quantity:
            return False, f"Not enough '{item_name}' in {self.name}'s inventory. Has {item.quantity}, needs {quantity}."

        item.quantity -= quantity
        if item.quantity == 0:
            self.inventory.remove(item)
        print(f"Removed {quantity} of '{item_name}' from {self.name}. New inventory: {self.inventory}")
        return True, f"Successfully removed {quantity} of '{item_name}'."

# Mock database of actors/tokens
# In a real application, this would come from the game scene/engine
MOCK_ACTORS_DB = {
    "ControlledToken1": Actor(name="Player Alpha", token_id="ControlledToken1"),
    "ControlledToken2": Actor(name="Player Beta", token_id="ControlledToken2"),
    "ControlledToken3": Actor(name="Player Gamma", token_id="ControlledToken3"),
    "TokenC": Actor(name="NPC Charlie", token_id="TokenC"),
    "TokenD": Actor(name="NPC Delta", token_id="TokenD"),
    "TokenE": Actor(name="NPC Echo", token_id="TokenE"),
}

# Pre-populate some inventory for testing
MOCK_ACTORS_DB["ControlledToken1"].add_item("Health Potion", 5)
MOCK_ACTORS_DB["ControlledToken1"].add_item("Mana Potion", 3)
MOCK_ACTORS_DB["ControlledToken2"].add_item("Gold Coins", 100)


class TransferUI:
    def __init__(self, master):
        # In a real app, these lists would be dynamically populated
        self.controlled_tokens_for_dialog = [k for k,v in MOCK_ACTORS_DB.items() if "Player" in v.name] # Example: tokens for "Player..." actors
        self.all_scene_tokens_for_dropdown = list(MOCK_ACTORS_DB.keys())


        self.master = master
        master.title("Token Transfer")

        # Giver Token
        self.giver_token_label = ttk.Label(master, text="Giver Token:")
        self.giver_token_label.grid(row=0, column=0, sticky=tk.W, padx=5, pady=5)
        self.giver_token_var = tk.StringVar()
        self.giver_token_display = ttk.Label(master, textvariable=self.giver_token_var)
        self.giver_token_display.grid(row=0, column=1, sticky=(tk.W + tk.E), padx=5, pady=5)
        self.select_giver_button = ttk.Button(master, text="Select Giver", command=self.open_giver_selection_dialog)
        self.select_giver_button.grid(row=0, column=2, padx=5, pady=5)


        # Receiver Token
        self.receiver_token_label = ttk.Label(master, text="Select Receiver Token:")
        self.receiver_token_label.grid(row=1, column=0, sticky=tk.W, padx=5, pady=5)
        self.receiver_token_var = tk.StringVar()
        self.receiver_token_dropdown = ttk.Combobox(master, textvariable=self.receiver_token_var, values=self.all_scene_tokens_for_dropdown)
        self.receiver_token_dropdown.grid(row=1, column=1, sticky=(tk.W + tk.E), padx=5, pady=5)
        self.receiver_token_dropdown.config(state="readonly")
        self.receiver_token_dropdown.bind("<<ComboboxSelected>>", self.on_receiver_selected)

        # Item Name
        self.item_name_label = ttk.Label(master, text="Item Name:")
        self.item_name_label.grid(row=2, column=0, sticky=tk.W, padx=5, pady=5)
        self.item_name_entry = ttk.Entry(master)
        self.item_name_entry.grid(row=2, column=1, sticky=(tk.W + tk.E), padx=5, pady=5)

        # Quantity
        self.quantity_label = ttk.Label(master, text="Quantity:")
        self.quantity_label.grid(row=3, column=0, sticky=tk.W, padx=5, pady=5)
        self.quantity_entry = ttk.Entry(master)
        self.quantity_entry.grid(row=3, column=1, sticky=(tk.W + tk.E), padx=5, pady=5)

        # Transfer Button
        self.transfer_button = ttk.Button(master, text="Transfer", command=self.perform_transfer)
        self.transfer_button.grid(row=4, column=0, columnspan=3, pady=10) # Adjusted columnspan

        # Configure column weights for resizing
        master.columnconfigure(1, weight=1)

    def open_giver_selection_dialog(self):
        # Ensure controlled tokens list is up-to-date if actors can change
        dialog = GiverSelectionDialog(self.master, title="Select Giver Token", controlled_tokens=self.controlled_tokens_for_dialog)
        if dialog.selected_token:
            self.giver_token_var.set(dialog.selected_token)
            # Prevent selecting the same token for giver and receiver
            if self.giver_token_var.get() == self.receiver_token_var.get():
                self.receiver_token_var.set("") # Clear receiver if it's same as new giver

    def on_receiver_selected(self, event=None):
        # Prevent selecting the same token for giver and receiver
        if self.giver_token_var.get() and self.giver_token_var.get() == self.receiver_token_var.get():
            messagebox.showwarning("Selection Error", "Giver and Receiver tokens cannot be the same. Please select a different Receiver token.")
            self.receiver_token_var.set("")

    def perform_transfer(self):
        giver_token_id = self.giver_token_var.get()
        receiver_token_id = self.receiver_token_var.get()
        item_name_str = self.item_name_entry.get()
        quantity_str = self.quantity_entry.get()

        # Basic validation
        if not giver_token_id:
            messagebox.showerror("Error", "Giver token not selected.")
            return
        if not receiver_token_id:
            messagebox.showerror("Error", "Receiver token not selected.")
            return
        if giver_token_id == receiver_token_id:
            messagebox.showerror("Error", "Giver and Receiver tokens cannot be the same.")
            return
        if not item_name_str:
            messagebox.showerror("Error", "Item name cannot be empty.")
            return

        try:
            quantity = int(quantity_str)
            if quantity <= 0:
                raise ValueError
        except ValueError:
            messagebox.showerror("Error", "Quantity must be a positive integer.")
            return

        print(f"Attempting to transfer {quantity} of '{item_name_str}' from {giver_token_id} to {receiver_token_id}")

        # 1. Get Giver actor and Receiver actor from tokens
        giver_actor = MOCK_ACTORS_DB.get(giver_token_id)
        receiver_actor = MOCK_ACTORS_DB.get(receiver_token_id)

        if not giver_actor:
            messagebox.showerror("Error", f"Could not find Giver actor for token '{giver_token_id}'.")
            return
        if not receiver_actor:
            messagebox.showerror("Error", f"Could not find Receiver actor for token '{receiver_token_id}'.")
            return

        # 2. Find the item in the Giver's inventory & 3. Check quantity (done by remove_item)
        # 4. If enough, remove from Giver and add to Receiver
        # 5. If not enough, show error.

        success, message = giver_actor.remove_item(item_name_str, quantity)

        if success:
            receiver_actor.add_item(item_name_str, quantity)
            transfer_summary = f"Transferred {quantity} of '{item_name_str}' from {giver_actor.name} to {receiver_actor.name}."
            messagebox.showinfo("Success", transfer_summary)
            self.display_chat_message(giver_actor, receiver_actor, item_name_str, quantity)
            print(f"Giver ({giver_actor.name}) inventory: {giver_actor.inventory}")
            print(f"Receiver ({receiver_actor.name}) inventory: {receiver_actor.inventory}")
            # Optionally, clear fields
            self.item_name_entry.delete(0, tk.END)
            self.quantity_entry.delete(0, tk.END)
        else:
            messagebox.showerror("Transfer Failed", message)

    def display_chat_message(self, giver_actor, receiver_actor, item_name, quantity):
        # In a real application, this would send a message to the game's chat system.
        chat_message = f"[CHAT] Transfer successful: {giver_actor.name} (token: {giver_actor.token_id}) gave {quantity} x '{item_name}' to {receiver_actor.name} (token: {receiver_actor.token_id})."
        print(chat_message) # Simulate displaying in chat


class GiverSelectionDialog(tk.Toplevel):
    def __init__(self, parent, title, controlled_tokens):
        super().__init__(parent)
        self.title(title)
        self.transient(parent) # Make dialog stay on top of the main window
        self.grab_set() # Modal behavior

        self.selected_token = None
        self.controlled_tokens = controlled_tokens

        self.label = ttk.Label(self, text="Select a token you control:")
        self.label.pack(padx=10, pady=10)

        self.token_listbox = tk.Listbox(self)
        for token in self.controlled_tokens:
            self.token_listbox.insert(tk.END, token)
        self.token_listbox.pack(padx=10, pady=5, fill=tk.BOTH, expand=True)

        self.select_button = ttk.Button(self, text="Select", command=self.on_select)
        self.select_button.pack(pady=5)

        self.cancel_button = ttk.Button(self, text="Cancel", command=self.destroy)
        self.cancel_button.pack(pady=5)

        # Center the dialog on the parent window
        self.update_idletasks()
        parent_x = parent.winfo_x()
        parent_y = parent.winfo_y()
        parent_width = parent.winfo_width()
        parent_height = parent.winfo_height()
        dialog_width = self.winfo_width()
        dialog_height = self.winfo_height()
        position_x = parent_x + (parent_width // 2) - (dialog_width // 2)
        position_y = parent_y + (parent_height // 2) - (dialog_height // 2)
        self.geometry(f"+{position_x}+{position_y}")


    def on_select(self):
        selected_index = self.token_listbox.curselection()
        if selected_index:
            self.selected_token = self.controlled_tokens[selected_index[0]]
            self.destroy()

if __name__ == '__main__':
    root = tk.Tk()
    app = TransferUI(root)
    root.mainloop()
