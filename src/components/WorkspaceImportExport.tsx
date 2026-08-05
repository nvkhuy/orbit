import { useState, useRef } from 'preact/hooks';

const SketchImportIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, transform: 'rotate(-2deg)' }}
  >
    <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const SketchExportIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, transform: 'rotate(2deg)' }}
  >
    <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

export default function WorkspaceImportExport() {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'error' | 'success' } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const res = await fetch('/api/workspace/export');
      if (!res.ok) {
        throw new Error('Export failed');
      }

      const contentDisposition = res.headers.get('Content-Disposition');
      let filename = 'orbit-workspace.zip';
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match && match[1]) {
          filename = match[1];
        }
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setNotification({ message: 'Failed to export workspace: ' + (err.message || err), type: 'error' });
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    setPendingFile(file);
    setShowConfirmModal(true);
  };

  const handleConfirmImport = async () => {
    if (!pendingFile) return;

    setShowConfirmModal(false);

    try {
      setIsImporting(true);
      const formData = new FormData();
      formData.append('file', pendingFile);

      const res = await fetch('/api/workspace/import', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Import failed');
      }

      // Immediately refresh the workspace page so new data displays automatically
      window.location.reload();
    } catch (err: any) {
      setNotification({ message: 'Failed to import workspace: ' + (err.message || err), type: 'error' });
    } finally {
      setIsImporting(false);
      setPendingFile(null);
    }
  };

  const handleCancelImport = () => {
    setShowConfirmModal(false);
    setPendingFile(null);
  };

  return (
    <div style={{ display: 'inline-flex', gap: '0.45rem', alignItems: 'center' }}>
      {/* Import button on LEFT with Sketch Icon */}
      <button
        type="button"
        onClick={handleImportClick}
        disabled={isExporting || isImporting}
        className="sketch-button secondary"
        style={{
          fontSize: '0.85rem',
          padding: '0.25rem 0.65rem',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.35rem',
          cursor: isImporting ? 'wait' : 'pointer',
        }}
        title="Import workspace zip file (replaces current workspace data)"
      >
        <SketchImportIcon />
        <span>{isImporting ? 'Importing...' : 'Import'}</span>
      </button>

      {/* Export button on RIGHT with Sketch Icon */}
      <button
        type="button"
        onClick={handleExport}
        disabled={isExporting || isImporting}
        className="sketch-button secondary"
        style={{
          fontSize: '0.85rem',
          padding: '0.25rem 0.65rem',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.35rem',
          cursor: isExporting ? 'wait' : 'pointer',
        }}
        title="Export workspace Markdown files as a zip file"
      >
        <SketchExportIcon />
        <span>{isExporting ? 'Exporting...' : 'Export'}</span>
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept=".zip"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {/* Custom Sketch Warning Dialog Modal */}
      {showConfirmModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(45, 45, 45, 0.65)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={handleCancelImport}
        >
          <div
            className="sketch-card postit"
            data-decoration="tape"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 'min(460px, 100%)',
              padding: '1.75rem 1.5rem 1.5rem',
              textAlign: 'center',
              boxShadow: '6px 6px 0px 0px var(--border)',
              transform: 'rotate(-1deg)',
              border: '3px solid var(--border)',
              borderRadius: 'var(--radius-wobbly-md)',
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem', lineHeight: '1' }}>⚠️</div>
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.85rem',
                marginBottom: '0.75rem',
                color: 'var(--fg)',
              }}
            >
              Replace Workspace Data?
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1.15rem',
                lineHeight: '1.5',
                color: 'var(--fg)',
                opacity: 0.9,
                marginBottom: '1.5rem',
              }}
            >
              Importing <strong>{pendingFile?.name}</strong> will <strong>REPLACE</strong> all existing projects, tasks, and agents in your Orbit workspace.
            </p>
            <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center' }}>
              <button
                type="button"
                className="sketch-button secondary"
                onClick={handleCancelImport}
                style={{ fontSize: '1rem', padding: '0.4rem 1.2rem' }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="sketch-button"
                onClick={handleConfirmImport}
                style={{
                  fontSize: '1rem',
                  padding: '0.4rem 1.2rem',
                  backgroundColor: 'var(--accent)',
                  color: '#ffffff',
                }}
              >
                ⚠️ Overwrite Workspace
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {notification && (
        <div
          style={{
            position: 'fixed',
            bottom: '1.5rem',
            right: '1.5rem',
            zIndex: 10000,
            backgroundColor: notification.type === 'error' ? '#ffebee' : '#e8f5e9',
            border: '2px solid var(--border)',
            borderRadius: 'var(--radius-wobbly-sm)',
            boxShadow: '4px 4px 0px 0px var(--border)',
            padding: '0.75rem 1.25rem',
            fontFamily: 'var(--font-heading)',
            fontSize: '1.1rem',
            color: 'var(--fg)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <span>{notification.message}</span>
          <button
            type="button"
            onClick={() => setNotification(null)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold',
            }}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
