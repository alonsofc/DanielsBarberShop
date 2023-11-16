<template>
    <form @submit.prevent="submitForm">
        <div class="mb-3 text-center">
            <div id="dia" class="fw-bold fs-3 text-primary">{{ cita.dia }}</div>
        </div>

        <div class="mb-3">
            <label for="horaInicio" class="form-label">De</label>
            <select v-model="cita.horaInicio" id="horaInicio" class="form-select">
                <option v-for="time in timeOptionsDe" :key="time.value" :value="time.value">
                    {{ time.label }}
                </option>
            </select>
        </div>

        <div class=" mb-3">
            <label for="horaFin" class="form-label">A</label>
            <select v-model="cita.horaFin" id="horaFin" class="form-select">
                <option v-for="time in timeOptionsA" :key="time.value" :value="time.value">
                    {{ time.label }}
                </option>
            </select>
        </div>

        <div class="mb-3">
            <label for="cliente" class="form-label">Cliente</label>
            <input type="text" v-model="cita.cliente" class="form-control" id="cliente" required autocomplete="off">
        </div>

        <div class="mb-3">
            <label for="servicio" class="form-label">Servicio</label>
            <select v-model="cita.servicio" class="form-select" id="servicio" required>
                <option value="Corte">Corte</option>
                <option value="Tatuaje">Tatuaje</option>
            </select>
        </div>

        <button type="submit" class="btn btn-primary">Guardar Cita</button>
    </form>
</template>
  
<script>
import { api } from '../configs/axiosConfig.js';
import { toast } from "../configs/toastConfig.js";

export default {
    props: {
        selectedDateTime: Date,
    },
    data() {
        return {
            cita: {
                id: null,
                dia: '',
                horaInicio: '',
                horaFin: '',
                cliente: '',
                servicio: 'Corte'
            }
        };
    },
    mounted() {
        this.initialize(this.selectedDateTime);
    },
    computed: {
        timeOptionsDe() {
            const options = [];
            const currentDate = new Date();
            let currentHour = currentDate.getHours();
            let currentMinute = currentDate.getMinutes();

            if (this.selectedDateTime !== null && (this.selectedDateTime.getDate() !== currentDate.getDate())) {
                currentHour = 0;
                currentMinute = 0;
            }

            const startHour = (currentHour < 9) ? 9 : currentHour;
            const startMinute = (currentHour < 9) ? 0 : Math.ceil(currentMinute / 30) * 30;

            for (let hours = startHour; hours <= 21; hours++) {
                for (let minutes = (hours === startHour) ? startMinute : 0; minutes < 60; minutes += 30) {
                    const period = hours >= 12 ? 'PM' : 'AM';
                    const formattedHours = hours % 12 || 12;
                    const formattedTime = {
                        value: `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`,
                        label: `${formattedHours}:${String(minutes).padStart(2, '0')} ${period}`,
                    };
                    options.push(formattedTime);
                }
            }
            return options;
        },
        timeOptionsA() {
            const options = this.timeOptionsDe.map(option => ({ ...option }));

            if (options.length > 0)
                options.shift();

            options.push({
                value: '22:00',
                label: '10:00 PM',
            });

            return options;
        },

    },
    methods: {
        initialize(dateTime, existingCita = null) {
            this.resetForm();

            this.cita.dia = this.formatLocalDate(dateTime);
            this.cita.horaInicio = this.formatLocalTime(dateTime);

            if (existingCita) {
                const [cliente, servicio] = existingCita.title.split(' (');
                this.cita.id = existingCita.id;
                this.cita.cliente = cliente;
                this.cita.servicio = servicio.slice(0, -1);
                this.cita.horaFin = this.formatLocalTime(existingCita.end);
            }
            else if (dateTime) {
                const horaFinDate = new Date(dateTime.getTime() + 30 * 60000);
                this.cita.horaFin = this.formatLocalTime(horaFinDate);
            }
        },
        formatLocalDate(date) {
            if (!date) return '';
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            const formattedDate = `${day}/${month}/${year}`;
            return formattedDate;
        },
        formatLocalTime(date) {
            if (!date) return '';
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            const formattedTime = `${hours}:${minutes}`;
            return formattedTime;
        },
        parseDateString(dateString) {
            const [day, month, year, time] = dateString.split(/[\s/]/);
            const [hour, minute] = time.split(':');
            const dateObject = new Date(year, month - 1, day, hour, minute);
            return dateObject;
        },
        async submitForm() {
            try {
                if (this.compareTimes(this.cita.horaInicio, this.cita.horaFin)) {
                    toast.warning("La hora de fin debe ser posterior a la hora de inicio.");
                    return;
                }

                var initDate = this.parseDateString(`${this.cita.dia} ${this.cita.horaInicio}`);
                var endDate = this.parseDateString(`${this.cita.dia} ${this.cita.horaFin}`);

                const appointment = {
                    start: initDate,
                    end: endDate,
                    title: `${this.cita.cliente} (${this.cita.servicio})`
                };

                const handleSuccess = (response) => {
                    this.$emit('cerrarModal');
                    this.$emit('citaGuardada');
                };

                if (this.cita.id) {
                    // Si hay una cita existente, actualiza la cita en lugar de crear una nueva
                    await api.putRequest(`/${this.cita.id}`, appointment, handleSuccess);
                } else {
                    // Si no hay cita existente, crea una nueva cita
                    await api.postRequest("", appointment, handleSuccess);
                }
            } catch (error) {
                console.error('Error al enviar la cita:', error);
            }
        },
        compareTimes(startTime, endTime) {
            const start = new Date(`2000-01-01T${startTime}`);
            const end = new Date(`2000-01-01T${endTime}`);
            return start >= end;
        },
        resetForm() {
            this.cita = {
                id: null,
                dia: '',
                horaInicio: '',
                horaFin: '',
                cliente: '',
                servicio: 'Corte'
            };
        }
    },
};
</script>