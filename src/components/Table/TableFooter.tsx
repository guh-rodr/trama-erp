import type { Table } from '@tanstack/react-table';
import { useTableParams } from '../../hooks/useTableParams';
import { TablePagination } from './TablePagination';

interface Props<TData> {
  table: Table<TData>;
}

export function TableFooter<TData>({ table }: Props<TData>) {
  const { params, setParams } = useTableParams();

  const pageCount = table.getPageCount();
  const rowCount = table.getRowCount();

  const setPage = (newPage: number) => {
    setParams({ page: newPage });
  };

  const selectedRowsCount = Object.keys(table.getState().rowSelection).length;

  return (
    <tfoot className="bg-white">
      <tr>
        <td colSpan={table.getAllColumns().length} className="py-4 px-6 text-sm">
          {!!rowCount && (
            <>
              <span className="text-neutral-500 inline-block mt-1.5 space-x-0.5">
                <span>
                  {rowCount} {rowCount > 1 ? 'itens' : 'item'}
                </span>

                <span className="px-1.5 text-neutral-400">·</span>

                <span>
                  {pageCount} página
                  {pageCount > 1 ? 's' : ''}
                </span>

                {selectedRowsCount > 0 && (
                  <>
                    <span className="px-1.5 text-neutral-400">·</span>
                    <span>
                      {selectedRowsCount} selecionado
                      {selectedRowsCount > 1 ? 's' : ''}
                    </span>
                  </>
                )}
              </span>

              <div className="float-right">
                <TablePagination
                  pageCount={pageCount}
                  pageIndex={params.page - 1}
                  setPage={setPage}
                  canClickPrev={table.getCanPreviousPage()}
                  canClickNext={table.getCanNextPage()}
                  goToPreviousPage={table.previousPage}
                  goToNextPage={table.nextPage}
                />
              </div>
            </>
          )}
        </td>
      </tr>
    </tfoot>
  );
}
