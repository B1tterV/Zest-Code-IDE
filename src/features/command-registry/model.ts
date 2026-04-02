export interface Command {
  id: string;
  label: string;
  shortcut?: string;
  handler: () => void | Promise<void>;
}

class CommandRegistry {
  private commands: Map<string, Command> = new Map();

  register(command: Command) {
    console.log(`[CommandRegistry] Registered: ${command.id}`);
    this.commands.set(command.id, command);
  }

  async execute(id: string) {
    const command = this.commands.get(id);
    if (!command) {
      console.error(`[CommandRegistry] Command not found: ${id}`);
      return;
    }
    console.log(`[CommandRegistry] Executing: ${command.label}`);
    await command.handler();
  }
}

// Singleton instance
export const commandRegistry = new CommandRegistry();