/* eslint-disable no-alert */
import React, { useEffect, /* useState */ } from "react";
import { useHistory } from "react-router-dom";
import MaterialTable, {
  MTableToolbar,
  MTableBody,
  // MTableFilterRow,
} from "material-table";
import TablePagination from "@material-ui/core/TablePagination";
import Button from "@material-ui/core/Button";
import PostAddIcon from "@material-ui/icons/PostAdd";
// import { PERMISSIONS } from 'src/shared/constants/permissions.contants';
// import TextField from "@material-ui/core/TextField";
// import InputAdornment from "@material-ui/core/InputAdornment";
// import Tooltip from "@material-ui/core/Tooltip";
// import FilterListIcon from "@material-ui/icons/FilterList";

type Props = {
  patios: any;
  loadPatiosAction: Function;
  deletePatioAction: Function,
  loading: boolean;
  paging: any;
  // isAllowed: Function,
  filters: any;
};

export const PatiosTable = (props: Props) => {
  const {
    patios,
    loadPatiosAction,
    deletePatioAction,
    loading,
    paging /* isAllowed */,
    filters,
  } = props;
  const { count, page, per_page, order } = paging;
  const history = useHistory();
  // const [listOrder, setListOrder] = useState<string>("");
  // const customSort = () => 0;
  const customFilterAndSearch = (term: any, rowData: any) => true;
  const draggable: boolean = false;
  const sorting: boolean = false;
  const columns = [
    {
      title: "ID",
      field: "id",
      // customSort,
      customFilterAndSearch,
      sorting: !sorting,
      filtering: false,
      defaultSort: "asc",
    },
    {
      title: "Clave",
      field: "code",
      sorting: !sorting,
      customFilterAndSearch,
      filtering: false,
      defaultSort: "asc",
    },
    {
      title: "Descripción",
      field: "title",
      sorting: !sorting,
      customFilterAndSearch,
      filtering: false,
    },
  ];
  const getColumnNameByIndex = (columnId: number) =>
    columns.map((column) => column.field)[columnId];
  useEffect(() => {
    loadPatiosAction({ per_page: paging.per_page, order });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <MaterialTable
      title=""
      onOrderChange={(orderBy: number, orderDirection: "asc" | "desc") => {
        loadPatiosAction({
          //...paging,
          order: orderDirection,
          order_by: getColumnNameByIndex(orderBy),
        });
      }}
      columns={columns as any}
      data={patios || []}
      options={{
        draggable,
        initialPage: 1, // @todo include this settings value in a CONSTANTS file
        paging: true,
        // pageSize: per_page,
        thirdSortClick: false,
        actionsColumnIndex: 5, // @todo this shouldn't be hardcoded, calculate using columns.lenght
        filtering: true,
      }}
      components={{
        // FilterRow: props => <><MTableFilterRow {...props}  /><div>asassa</div></>,
        Pagination: (componentProps) => {
          return (
            <TablePagination
              {...componentProps}
              count={count}
              page={page - 1 || 0}
              rowsPerPage={per_page}
              rowsPerPageOptions={[5, 10, 25, 50, 100]}
              onChangePage={(event, currentPage: number) => {
                loadPatiosAction({
                  per_page,
                  page: currentPage + 1,
                  order,
                  // offset: nextPage * 1,
                  filters,
                });
              }}
              onChangeRowsPerPage={(event: any) => {
                componentProps.onChangeRowsPerPage(event);
                loadPatiosAction({
                  per_page: event.target.value,
                });
              }}
            />
          );
        },
        Toolbar: (componentProps) => {
          return (
            <div>
              <MTableToolbar {...componentProps} />
              <div style={{ padding: "0px 10px", textAlign: "right" }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<PostAddIcon />}
                  size="medium"
                  onClick={() => history.push("/patio/create")}
                >
                  Agregar Patio
                </Button>
              </div>
            </div>
          );
        },
        Body: (bodyProps) => (
          <MTableBody
            {...bodyProps}
            onFilterChanged={(columnId: number, value: string) => {
              bodyProps.onFilterChanged(columnId, value);
              loadPatiosAction({
                filters: {
                  ...filters,
                  [getColumnNameByIndex(columnId)]: value,
                },
              });
            }}
          />
        ),
      }}
      actions={[
        {
          icon: "edit",
          tooltip: "Editar Patio",
          onClick: (event, rowData: any) =>
            history.push(`/patio/${rowData.id}/edit`),
          // disabled: !isAllowed('USR', PERMISSIONS.UPDATE),
        },
        {
          icon: "delete",
          tooltip: "Eliminar Patio",
          onClick: (event, rowData: any) => {
            if (
              // eslint-disable-next-line no-restricted-globals
              confirm(
                `¿Realmente quieres eliminar el Patio ${rowData.id}?\n Esta acción es irreversible`
              )
            ) {
              deletePatioAction(rowData.id);
            }
          },
          // disabled: !isAllowed('USR', PERMISSIONS.DELETE),
        },
      ]}
      isLoading={loading}
    />
  );
};
