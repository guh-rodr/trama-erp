import { XIcon } from '@phosphor-icons/react';
import React, { useCallback, useMemo, useRef, useState, type ReactNode } from 'react';
import ReactDOM from 'react-dom';
import { DialogContext, type DialogContextProps, type DialogProps } from './dialog-context';

type DialogComponentProps = Pick<DialogProps, 'title' | 'content' | 'id'> & Pick<DialogContextProps, 'closeDialog'>;

const DialogDropdown = React.memo(({ content }: DialogComponentProps) => content);

const DialogModal = React.memo(({ title, content }: DialogComponentProps) => (
  <div className="z-50 m-4 mx-auto w-5/6 max-w-md rounded-2xl bg-white p-5">
    <div className="flex items-center justify-between pb-4">
      <h2 className="text-xl font-semibold">{title}</h2>
    </div>
    <div className="mt-4">{content}</div>
  </div>
));

const DialogDrawer = React.memo(({ title, content, closeDialog }: DialogComponentProps) => (
  <div className="z-50 flex h-full max-w-11/12 min-w-md ml-auto flex-col overflow-y-auto rounded-l-2xl bg-neutral-100 p-4">
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-semibold">{title}</h2>

      <button className="text-neutral-500" onClick={() => closeDialog()}>
        <XIcon />
      </button>
    </div>
    <div className="mt-4 flex-1">{content}</div>
  </div>
));

export const DialogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [dialogs, setDialogs] = useState<DialogProps[]>([]);
  const idCounter = useRef(0);

  const openDialog = useCallback((props: DialogProps) => {
    document.body.style.overflow = 'hidden';

    const newId = props.id ?? `dialog_${idCounter.current++}`;

    const dialogWithId = { ...props, id: newId };
    setDialogs((prev) => [...prev, dialogWithId]);
  }, []);

  const closeDialog = useCallback((id?: string) => {
    document.body.style.overflow = 'auto';

    setDialogs((prev) => (id ? prev.filter((d) => d.id !== id) : prev.slice(0, -1)));
  }, []);

  const closeAll = useCallback(() => {
    setDialogs([]);
  }, []);

  const contextValue = useMemo(() => ({ openDialog, closeDialog, closeAll }), [openDialog, closeDialog, closeAll]);

  const handleOverlay = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) closeDialog();
    },
    [closeDialog],
  );

  return (
    <DialogContext.Provider value={{ ...contextValue, isOpen: !!dialogs.length }}>
      {children}

      {ReactDOM.createPortal(
        <>
          {dialogs.map((dialog, index) => (
            <div
              key={dialog.id}
              className={`fixed inset-0 z-40 flex items-center justify-center bg-black/70 ${index === dialogs.length - 1 ? 'backdrop-blur' : ''}`}
              onMouseDown={handleOverlay}
            >
              {dialog.type === 'modal' && (
                <DialogModal
                  id={dialog.id}
                  title={dialog.title}
                  content={dialog.content}
                  closeDialog={() => closeDialog(dialog.id)}
                />
              )}

              {dialog.type === 'drawer' && (
                <DialogDrawer
                  id={dialog.id}
                  title={dialog.title}
                  content={dialog.content}
                  closeDialog={() => closeDialog(dialog.id)}
                />
              )}

              {dialog.type === 'dropdown' && (
                <DialogDropdown
                  id={dialog.id}
                  title={dialog.title}
                  content={dialog.content}
                  closeDialog={() => closeDialog(dialog.id)}
                />
              )}
            </div>
          ))}
        </>,
        document.body,
      )}
    </DialogContext.Provider>
  );
};
