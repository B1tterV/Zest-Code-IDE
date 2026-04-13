import { invoke } from "@tauri-apps/api/core";
import { save } from "@tauri-apps/plugin-dialog";
import { useEditorStore } from "@/entities/editor";
import { useFileStore } from "@/entities/file";

export const useSaveFile = () => {
  const {
    tabs,
    activeTabId,
    dockviewApi,
    setSaved,
    updateTabContent,
    closeTab,
    openTab,
  } = useEditorStore();
  const { addNode } = useFileStore();

  const saveActiveFile = async () => {
    const activeTab = tabs.find((t) => t.id === activeTabId);
    if (!activeTab || !activeTab.isDirty) return;

    try {
      if (activeTab.isVirtual) {
        return await saveAs();
      }

      await invoke("save_file_content", {
        path: activeTab.id,
        content: activeTab.content,
      });
      setSaved(activeTab.id);
    } catch (e) {
      console.error("Save failed:", e);
    }
  };

  const saveAs = async () => {
    const activeTab = tabs.find((t) => t.id === activeTabId);
    if (!activeTab) return;

    const currentExt = activeTab.title.split(".").pop() || "*";

    const newPathRaw = await save({
      defaultPath: activeTab.isVirtual ? activeTab.title : activeTab.id,
      filters: [
        { name: currentExt.toUpperCase(), extensions: [currentExt] },
        { name: "All Files", extensions: ["*"] },
      ],
    });

    if (newPathRaw) {
      const newPath = newPathRaw.replace(/\//g, "\\");

      try {
        await invoke("save_file_content", {
          path: newPath,
          content: activeTab.content,
        });

        const pathParts = newPath.split(/[\\/]/);
        const newTitle = pathParts.pop() || activeTab.title;
        const parentPath = pathParts.join("\\");

        addNode(parentPath, {
          name: newTitle,
          path: newPath,
          is_dir: false,
          is_ignored: false,
          isOpen: false,
        });

        const oldId = activeTab.id;
        const content = activeTab.content;

        if (dockviewApi) {
          const oldPanel = dockviewApi.getPanel(oldId);
          if (oldPanel) {
            oldPanel.api.close();
          }
        }

        closeTab(oldId);
        openTab({
          id: newPath,
          title: newTitle,
          content: content,
          isDirty: false,
          isVirtual: false,
        });

        if (dockviewApi) {
          dockviewApi.addPanel({
            id: newPath,
            title: newTitle,
            component: "editor",
            tabComponent: "default",
            params: { id: newPath },
          });

          const newPanel = dockviewApi.getPanel(newPath);
          if (newPanel) {
            newPanel.api.setActive();
          }
        }

        setSaved(newPath);
      } catch (e) {
        console.error("Save As failed:", e);
      }
    }
  };

  const saveAll = async () => {
    const dirtyTabs = tabs.filter((t) => t.isDirty);
    await Promise.all(
      dirtyTabs.map((tab) =>
        invoke("save_file_content", {
          path: tab.id,
          content: tab.content,
        }).then(() => setSaved(tab.id)),
      ),
    );
  };

  const revertFile = async () => {
    const activeTab = tabs.find((t) => t.id === activeTabId);
    if (!activeTab) return;

    const freshContent = await invoke<string>("read_file_content", {
      path: activeTab.id,
    });
    updateTabContent(activeTab.id, freshContent);
    setSaved(activeTab.id);
  };

  return { saveActiveFile, saveAs, saveAll, revertFile };
};
