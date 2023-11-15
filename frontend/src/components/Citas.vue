<template>
    <div>
        <div class="header-container p-2 d-flex align-items-center justify-content-center">
            <img src="../assets/logo.jpg" alt="Daniel's Barber Shop" class="mr-3" width="50" height="50" />
            <h1 class="text-light m-0">Daniel's Barber Shop</h1>
        </div>
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-md-8">
                    <div class="wider-calendar bg-light p-3">
                        <FullCalendar ref="fullCalendar" :options="calendarOptions" />
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" tabindex="-1" ref="modalCita">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Cita</h5>
                    <button type="button" class="btn-close" @click="closeModal"></button>
                </div>
                <div class="modal-body">
                    <CitaForm ref="citaForm" :selectedDateTime="selectedDateTime" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import esLocale from '@fullcalendar/core/locales/es'
import axios from 'axios';
import CitaForm from './CitaForm.vue';

export default {
    components: {
        FullCalendar,
        CitaForm
    },
    data() {
        return {
            citas: [],
            selectedDateTime: null,
            calendarOptions: {
                plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
                initialView: 'dayGridMonth',
                weekends: true,
                dateClick: this.handleDateClick,
                eventClick: this.handleEventClick,
                events: [],
                locale: esLocale,
                headerToolbar: {
                    left: 'prev,next today',
                    center: 'title',
                    // right: 'dayGridMonth,timeGridWeek,timeGridDay'
                    right: 'dayGridMonth,timeGridDay'
                },
                slotDuration: '00:30:00',
                slotLabelInterval: { minutes: 30 },
                slotMinTime: '09:00:00',
                slotMaxTime: '22:00:00',
                slotLabelContent: this.customSlotLabelContent,
            }
        };
    },
    mounted() {
        this.getCitas();
    },
    methods: {
        async getCitas() {
            try {
                const response = await axios.get('http://localhost:3000/citas');
                this.citas = response.data.map(cita => ({
                    title: cita.title,
                    start: new Date(cita.start),
                    end: new Date(cita.end),
                }));
                this.calendarOptions.events = this.citas;
            } catch (error) {
                console.error(error);
            }
        },
        customSlotLabelContent(slotInfo) {
            const formattedHour = slotInfo.date.toLocaleString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
            });
            return formattedHour;
        },
        handleDateClick: function (arg) {
            const fullCalendarApi = this.$refs.fullCalendar.getApi();

            if (fullCalendarApi.currentData.currentViewType === "timeGridDay") {
                this.selectedDateTime = arg.date;

                if (!this.citas || !this.hasConflicts(arg.date)) {
                    this.$refs.citaForm.initialize(this.selectedDateTime);
                    this.openModal();
                } else {
                    alert('Ya existe una cita en este horario.');
                }
            }
            else {
                fullCalendarApi.gotoDate(arg.date);
                fullCalendarApi.changeView("timeGridDay");
            }
        },
        handleEventClick: function (clickInfo) {
            const fullCalendarApi = this.$refs.fullCalendar.getApi();

            if (fullCalendarApi.currentData.currentViewType !== "timeGridDay") {
                fullCalendarApi.gotoDate(clickInfo.event.start);
                fullCalendarApi.changeView("timeGridDay");
            }

            this.selectedDateTime = clickInfo.event.start;
            const existingCita = this.getExistingCita(this.selectedDateTime);

            if (existingCita) {
                this.$refs.citaForm.initialize(this.selectedDateTime, existingCita);
                this.openModal();
            }
        },
        getExistingCita(dateTime) {
            return this.citas.find((cita) =>
                dateTime >= new Date(cita.start) && dateTime < new Date(cita.end)
            );
        },
        hasConflicts(dateTime) {
            const hasConflict = this.citas.some((cita) =>
                dateTime >= new Date(cita.start) && dateTime < new Date(cita.end)
            );
            return hasConflict;
        },
        openModal() {
            this.$refs.modalCita.classList.add("show", "modal-fade");
            this.$refs.modalCita.style.display = "block";
            document.body.classList.add("modal-open");
        },
        closeModal() {
            this.$refs.modalCita.classList.remove("show", "modal-fade");
            this.$refs.modalCita.style.display = "none";
            document.body.classList.remove("modal-open");
        },
    },
};
</script>

<style>
/* Estilos para mejorar la apariencia en pantallas pequeñas */
@media (max-width: 576px) {
    .text-center {
        text-align: center !important;
    }

    .wider-calendar {
        padding: 0 10px;
        /* Ajusta el espaciado lateral según sea necesario */
    }
}

/* Establecemos el fondo negro y el texto blanco para la página */
body {
    background-color: #000;
    color: #fff;
}

/* Estilos para el encabezado con la imagen y el título */
.header-container {
    display: flex;
    align-items: center;
}

.header-container img {
    border-radius: 50%;
}
</style>