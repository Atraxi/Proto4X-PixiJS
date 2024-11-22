class KeyEventManager {
	private listeners: Map<string, {
    context: string | null,
    keyDownCallback: ((event: KeyboardEvent) => void),
    keyUpCallback: ((event: KeyboardEvent) => void) | null
  }[]>
	private activeContext: string|null;

  constructor() {
    this.listeners = new Map();
    this.activeContext = null;

    window.addEventListener('keydown', this.handleKeyDown.bind(this));
    window.addEventListener('keyup', this.handleKeyUp.bind(this));
  }

  /**
   * Subscribe to a key event.
   * @param keyCombo - The key combination, e.g., "Ctrl+Shift+S".
   * @param keyDownCallback - The function to call when the keydown event occurs.
   * @param keyUpCallback - The function to call when the keydown event occurs.
   * @param context - Optional context to group subscriptions.
   */
  subscribe(keyCombo: string,
    keyDownCallback: (event: KeyboardEvent) => void,
    keyUpCallback: ((event: KeyboardEvent) => void) | null = null,
    context: string|null = "gameplay")
  {
    const combo = this.normalizeKeyCombo(keyCombo);
    if (!this.listeners.has(combo)) {
      this.listeners.set(combo, [{context, keyDownCallback, keyUpCallback}]);
    } else {
    	this.listeners.get(combo)!.push({context, keyDownCallback, keyUpCallback});
		}
  }

  /**
   * Unsubscribe from a specific key event or all events in a context.
   * @param keyCombo - The key combination to unsubscribe from or null to target the context.
   * @param context - The context to remove, if applicable.
   */
  unsubscribe(keyCombo: string|null = null, context: string|null = null) {
    if (keyCombo) {
      const combo = this.normalizeKeyCombo(keyCombo);
      this.listeners.delete(combo);
    } else if (context) {
      for (const [combo, callbacks] of this.listeners.entries()) {
				this.listeners.set(
          combo,
          callbacks.filter(listener => {
						return listener.context !== context;
					})
        );
      }
    }
  }

  /**
   * Set the active context for the key manager.
   * @param context - The active context, or null for global.
   */
  setContext(context: string|null) {
    this.activeContext = context;
  }

  // Handle keydown event
  handleKeyDown(event: KeyboardEvent) {
    const combo = this.buildCombo(event);
    if (this.listeners.has(combo)) {
      for (const listener of this.listeners.get(combo)!) {
        if (listener.context === this.activeContext || !listener.context) {
          listener.keyDownCallback(event);
        }
      }
    }
  }

  // Handle keyup event (optional, for releasing keys)
  handleKeyUp(event: KeyboardEvent) {
    const combo = this.buildCombo(event);
    if (this.listeners.has(combo)) {
      for (const listener of this.listeners.get(combo)!) {
        if (listener.keyUpCallback && (listener.context === this.activeContext || !listener.context)) {
          listener.keyUpCallback(event);
        }
      }
    }
  }

  // Utility to normalize key combinations
  normalizeKeyCombo(combo: string) {
    return combo
      .toLowerCase()
      .split('+')
      .sort()
      .join('+');
  }

  // Utility to build the key combo from an event
  buildCombo(event: KeyboardEvent) {
    const keys = [];
    if (event.ctrlKey) keys.push('ctrl');
    if (event.shiftKey) keys.push('shift');
    if (event.altKey) keys.push('alt');
    keys.push(event.key.toLowerCase());
    return keys.sort().join('+');
  }
}
let keyEventManager = new KeyEventManager
export { keyEventManager }