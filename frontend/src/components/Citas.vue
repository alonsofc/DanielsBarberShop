<template>
    <div>
        <div class="header-container p-2 d-flex align-items-center justify-content-center">
            <img src="../assets/logo.jpg" alt="Daniel's Barber Shop" class="mr-3" width="50" height="50" />
            <h1 class="text-light m-0">Daniel's Barber Shop</h1>
        </div>
        <div class="container bg-light pt-3">
            <FullCalendar ref="fullCalendar" :options="calendarOptions" />
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
                    <CitaForm ref="citaForm" :selectedDateTime="selectedDateTime" @citaGuardada="handleCitaGuardada" />
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
import { api } from '../configs/axiosConfig.js';
import { toast } from "../configs/toastConfig.js";
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
                    right: 'dayGridMonth,timeGridDay'
                },
                validRange: {
                    start: new Date(),
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
        this.setupCalendarEvents();
    },
    methods: {
        async getCitas() {
            const handleSuccess = (response) => {
                this.citas = response.map(cita => ({
                    id: cita.id,
                    title: cita.title,
                    start: new Date(cita.start),
                    end: new Date(cita.end),
                    color: this.getColorForService(cita.title)
                }));
                this.calendarOptions.events = this.citas;
            };

            await api.getRequest("", handleSuccess);
        },
        setupCalendarEvents() {
            const fullCalendarApi = this.$refs.fullCalendar.getApi();

            fullCalendarApi.on('datesSet', (arg) => {
                this.calendarOptions.slotMinTime = this.calculateSlotMinTime(arg.start);
                fullCalendarApi.setOption('slotMinTime', this.calendarOptions.slotMinTime);
            });
        },
        getColorForService(serviceText) {
            const regexResult = /\(([^)]+)\)/.exec(serviceText);

            if (regexResult && regexResult.length > 1) {
                const servicio = regexResult[1];

                const colorMapping = {
                    'Corte': '#7D3C98',
                    'Tatuaje': '#1C2833',
                };

                return colorMapping[servicio];
            }

            return '';
        },
        calculateSlotMinTime(selectedDate) {
            const currentDate = new Date();
            const isToday = this.isSameDate(selectedDate, currentDate);

            if (isToday) {
                const hours = currentDate.getHours();
                const minutes = currentDate.getMinutes();

                if (hours < 9 || (hours === 9 && minutes === 0)) {
                    return "09:00:00";
                } else {
                    const roundedHour = (minutes >= 30) ? hours + 1 : hours;
                    const roundedMinutes = (minutes >= 30) ? 0 : 30;
                    return `${String(roundedHour).padStart(2, '0')}:${String(roundedMinutes).padStart(2, '0')}:00`;
                }
            } else {
                return "09:00:00";
            }
        },
        isSameDate: function (date1, date2) {
            return (
                date1.getFullYear() === date2.getFullYear() &&
                date1.getMonth() === date2.getMonth() &&
                date1.getDate() === date2.getDate()
            );
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
                } else
                    toast.warning("Ya existe una cita a esta misma hora.");
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
        handleCitaGuardada() {
            this.getCitas();
            this.closeModal();
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
@media (max-width: 575.98px) {
    .fc .fc-toolbar {
        align-items: normal;
    }

    .fc .fc-button-group {
        display: inline-grid;
    }

    .fc-direction-ltr .fc-toolbar>*> :not(:first-child) {
        margin-top: 10px;
        margin-left: 0;
    }
}
</style>