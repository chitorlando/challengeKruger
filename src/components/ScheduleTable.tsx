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
import { useRouter, usePathname } from 'next/navigation';

interface Schedule {
    id: number;
    nombreSector: string;
    horaInicio: string;
    horaFin: string;
    poligono: string;
}

interface Column {
    id: keyof Schedule | 'actions';
    label: string;
    minWidth?: number;
    align?: 'center' | 'right' | 'left';
}

const columns: readonly Column[] = [
    { id: 'actions', label: 'Acciones', align: 'center' },
    { id: 'nombreSector', label: 'Nombre del Sector', minWidth: 170 },
    { id: 'horaInicio', label: 'Hora de Inicio', minWidth: 100 },
    { id: 'horaFin', label: 'Hora de Fin', minWidth: 100 },
    { id: 'poligono', label: 'Polígono', minWidth: 200 },
];

export const ScheduleTable = () => {


    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [open, setOpen] = useState(false);
    const [scheduleToDelete, setScheduleToDelete] = useState<number | null>(null);
    const router = useRouter();
    const pathname = usePathname();

    const isAdminRoute = pathname.startsWith('/admin');

    // Obtener los horarios desde el backend
    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                const response = await fetch('/api/schedules');
                const data = await response.json();
                setSchedules(data);
            } catch (error) {
                console.error('Error al obtener los horarios:', error);
            }
        };

        fetchSchedules();
    }, []);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleEdit = (id: number) => {
        router.push(`/admin/register-schedule?id=${id}`);
    };

    const handleDelete = async () => {
        if (scheduleToDelete !== null) {
            try {
                const response = await fetch(`/api/schedules/${scheduleToDelete}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    throw new Error('Error al eliminar el horario');
                }

                setSchedules((prev) => prev.filter((schedule) => schedule.id !== scheduleToDelete));
                console.log(`Horario con ID: ${scheduleToDelete} eliminado.`);
            } catch (error) {
                console.error('Error al eliminar el horario:', error);
            } finally {
                handleCloseModal();
            }
        }
    };

    const handleOpenModal = (id: number) => {
        setScheduleToDelete(id);
        setOpen(true);
    };

    const handleCloseModal = () => {
        setOpen(false);
        setScheduleToDelete(null);
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
            <TableContainer sx={{ maxHeight: 'auto' }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => {
                                // No renderizar la columna de acciones si no es ruta de admin
                                if (column.id === 'actions' && !isAdminRoute) {
                                    return null;
                                }
                                return (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth }}
                                    >
                                        {column.label}
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {schedules
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((schedule) => (
                                <TableRow hover role="checkbox" tabIndex={-1} key={schedule.id}>
                                    {columns.map((column) => {
                                        if (column.id === 'actions' && !isAdminRoute) {
                                            return null; // No renderizar las acciones si no es ruta de admin
                                        }
                                        if (column.id === 'actions') {
                                            return (
                                                <TableCell key={column.id} align={column.align}>
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                            gap: 1,
                                                        }}
                                                    >
                                                        <IconButton
                                                            color="primary"
                                                            onClick={() => handleEdit(schedule.id)}
                                                        >
                                                            <Edit />
                                                        </IconButton>
                                                        <IconButton
                                                            color="error"
                                                            onClick={() => handleOpenModal(schedule.id)}
                                                        >
                                                            <Delete />
                                                        </IconButton>
                                                    </Box>
                                                </TableCell>
                                            );
                                        }

                                        const value = schedule[column.id as keyof Schedule];
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
                count={schedules.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />

            <Dialog open={open} onClose={handleCloseModal}>
                <DialogTitle>Confirmar Eliminación</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        ¿Estás seguro de que deseas eliminar este horario? Esta acción no se puede deshacer.
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
