
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
} from '@mui/material';

import { Edit, Delete } from '@mui/icons-material';

import React, { useEffect, useState } from 'react';

interface Client {
    id: number;
    cedula: string;
    coordenadas: string;
    usuarioId: number;
    nombre: string;
    apellido: string;
    email: string;
}

interface Column {
    id: keyof Client | 'actions';
    label: string;
    minWidth?: number;
    align?: 'center' | 'right' | 'left';
}

const columns: readonly Column[] = [
    { id: 'actions', label: 'Acciones', align: 'center' },
    { id: 'nombre', label: 'Nombre', minWidth: 170 },
    { id: 'apellido', label: 'Apellido', minWidth: 170 },
    { id: 'email', label: 'Correo Electrónico', minWidth: 200 },
    { id: 'cedula', label: 'Cédula', minWidth: 150 },
    { id: 'coordenadas', label: 'Coordenadas', minWidth: 200 },
];

export const ClientsTable = () => {

    const [clients, setClients] = useState<Client[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [open, setOpen] = useState(false);
    const [clientToDelete, setClientToDelete] = useState<number | null>(null);


    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await fetch('/api/clients');
                const data = await response.json();
                setClients(data);
            } catch (error) {
                console.error('Error al obtener los clientes:', error);
            }
        };

        fetchClients();
    }, []);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleEdit = (id: number) => {
        console.log(`Editar cliente con ID: ${id}`);
        // Aquí iría la lógica para editar el cliente
    };

    const handleDelete = async () => {
        if (clientToDelete !== null) {
            try {
                const response = await fetch(`/api/clients/${clientToDelete}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    throw new Error('Error al eliminar el cliente');
                }

                // Actualiza la lista de clientes eliminando el cliente del estado
                setClients((prev) => prev.filter((client) => client.id !== clientToDelete));
                console.log(`Cliente con ID: ${clientToDelete} eliminado.`);
            } catch (error) {
                console.error('Error al eliminar el cliente:', error);
            } finally {
                handleCloseModal();
            }
        }
    };

    const handleOpenModal = (id: number) => {
        setClientToDelete(id);
        setOpen(true);
    };

    const handleCloseModal = () => {
        setOpen(false);
        setClientToDelete(null);
    };


    return (
        <Box
            sx={{
                width: '100%',
                overflow: 'hidden',
                boxShadow: 2,
                px: '1rem',
                borderRadius: '1rem',
            }}
        >
            <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {clients
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((client) => (
                                <TableRow hover role="checkbox" tabIndex={-1} key={client.id}>
                                    {columns.map((column) => {
                                        if (column.id === 'actions') {
                                            return (
                                                <TableCell key={column.id} align={column.align}>
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                            gap: 1, // Espacio entre los botones
                                                        }}
                                                    >
                                                        <IconButton
                                                            color="primary"
                                                            onClick={() => handleEdit(client.id)}
                                                        >
                                                            <Edit />
                                                        </IconButton>
                                                        <IconButton
                                                            color="error"
                                                            onClick={() => handleOpenModal(client.id)}
                                                        >
                                                            <Delete />
                                                        </IconButton>
                                                    </Box>
                                                </TableCell>
                                            );
                                        }

                                        const value = client[column.id as keyof Client];
                                        return (
                                            <TableCell key={column.id} align={column.align}>
                                                {value}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={clients.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />


            <Dialog open={open} onClose={handleCloseModal}>
                <DialogTitle>Confirmar Eliminación</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        ¿Estás seguro de que deseas eliminar este cliente? Esta acción no se puede deshacer.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={handleDelete} color="warning" autoFocus>
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>

        </Box>
    );
};
