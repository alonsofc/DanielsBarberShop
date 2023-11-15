<template>
    <form @submit.prevent="submitForm">
        <div class="mb-3 text-center">
            <div id="dia" class="fw-bold fs-3 text-primary">{{ cita.dia }}</div>
        </div>

        <div class="mb-3">
            <label for="horaInicio" class="form-label">De</label>
            <select v-model="cita.horaInicio" id="horaInicio" class="form-select">
                <option v-for="time in timeOptions" :key="time.value" :value="time.value">
                    {{ time.label }}
                </option>
            </select>
        </div>

        <div class=" mb-3">
            <label for="horaFin" class="form-label">A</label>
            <select v-model="cita.horaFin" id="horaFin" class="form-select">
                <option v-for="time in timeOptions" :key="time.value" :value="time.value">
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
import axios from 'axios';

export default {
    props: {
        selectedDateTime: Date,
    },
    data() {
        return {
            cita: {
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
        timeOptions() {
            const options = [];
            for (let hours = 9; hours <= 21; hours++) {
                for (let minutes = 0; minutes < 60; minutes += 30) {
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
    },
    methods: {
        initialize(dateTime, existingCita = null) {
            this.resetForm();
            this.cita.dia = this.formatLocalDate(dateTime);
            this.cita.horaInicio = this.formatLocalTime(dateTime);

            if (existingCita) {
                const [cliente, servicio] = existingCita.title.split(' (');
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
                var initDate = this.parseDateString(`${this.cita.dia} ${this.cita.horaInicio}`);
                var endDate = this.parseDateString(`${this.cita.dia} ${this.cita.horaFin}`);

                const appointment = {
                    start: initDate,
                    end: endDate,
                    title: `${this.cita.cliente} (${this.cita.servicio})`
                };

                await axios.post('http://localhost:3000/citas', appointment);

                alert('Cita registrada con éxito:', this.cita);

                this.resetForm();
            } catch (error) {
                console.error('Error al enviar la cita:', error);
            }
        },
        resetForm() {
            this.cita = {
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