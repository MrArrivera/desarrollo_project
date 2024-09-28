let currentQuestionWindow = true;  
/* Variable para verificar si estamos en la ventana de preguntas, ahi la activas para q solo funcionen los sensores cuando estamos en una pregunta*/

navigator.bluetooth.requestDevice({
  filters: [
    { 
      services: ['12345678-1234-5678-1234-56789abcdef0'], 
      name: 'Autocontrol_Equipo2' //  Es el nombre q le voy a poner a la ESP32
    }
  ]
})
.then(device => {
  return device.gatt.connect();
})
.then(server => {
  return server.getPrimaryService('12345678-1234-5678-1234-56789abcdef0');
})
.then(service => {
  return Promise.all([
    service.getCharacteristic('12345678-1234-5678-1234-56789abcdef1'), // Sensor letra "A"
    service.getCharacteristic('12345678-1234-5678-1234-56789abcdef2'), // Sensor letra "B"
    service.getCharacteristic('12345678-1234-5678-1234-56789abcdef3'), // Sensor letra "C"
    service.getCharacteristic('12345678-1234-5678-1234-56789abcdef4'), // Sensor letra "D"
    service.getCharacteristic('12345678-1234-5678-1234-56789abcdef5'), 
    // Limit Switch para ir a la pregunta anterior, por si se equivocan o algo 
    service.getCharacteristic('12345678-1234-5678-1234-56789abcdef6')  
    // Limit Switch siguiente pregunta
  ]);
})
.then(characteristics => {
  const sensorA_Characteristic = characteristics[0];
  const sensorB_Characteristic = characteristics[1];
  const sensorC_Characteristic = characteristics[2];
  const sensorD_Characteristic = characteristics[3];
  const prevCharacteristic = characteristics[4];
  const nextCharacteristic = characteristics[5];

  sensorA_Characteristic.startNotifications().then(_ => {
    console.log('Sensor A notifications started');
    sensorA_Characteristic.addEventListener('characteristicvaluechanged', event => {
      let value = new TextDecoder().decode(event.target.value);
      if (currentQuestionWindow && value === "1") {
        console.log('Sensor A activated');
        activateBuzzer();
        selectAnswer('A');
      }
    });
  });

  sensorB_Characteristic.startNotifications().then(_ => {
    console.log('Sensor B notifications started');
    sensorB_Characteristic.addEventListener('characteristicvaluechanged', event => {
      let value = new TextDecoder().decode(event.target.value);
      if (currentQuestionWindow && value === "1") {
        console.log('Sensor B activated');
        activateBuzzer();
        selectAnswer('B');
      }
    });
  });

  sensorC_Characteristic.startNotifications().then(_ => {
    console.log('Sensor C notifications started');
    sensorC_Characteristic.addEventListener('characteristicvaluechanged', event => {
      let value = new TextDecoder().decode(event.target.value);
      if (currentQuestionWindow && value === "1") {
        console.log('Sensor C activated');
        activateBuzzer();
        selectAnswer('C');
      }
    });
  });

  sensorD_Characteristic.startNotifications().then(_ => {
    console.log('Sensor D notifications started');
    sensorD_Characteristic.addEventListener('characteristicvaluechanged', event => {
      let value = new TextDecoder().decode(event.target.value);
      if (currentQuestionWindow && value === "1") {
        console.log('Sensor D activated');
        activateBuzzer();
        selectAnswer('D');
      }
    });
  });

  prevCharacteristic.startNotifications().then(_ => {
    console.log('Previous question notifications started');
    prevCharacteristic.addEventListener('characteristicvaluechanged', event => {
      let value = new TextDecoder().decode(event.target.value);
      if (value === "1") {
        console.log('Pregunta anterior');
        goToPreviousQuestion();
      }
    });
  });

  nextCharacteristic.startNotifications().then(_ => {
    console.log('Next question notifications started');
    nextCharacteristic.addEventListener('characteristicvaluechanged', event => {
      let value = new TextDecoder().decode(event.target.value);
      if (value === "1") {
        console.log('Siguiente pregunta');
        goToNextQuestion();
      }
    });
  });
})
.catch(error => {
  console.error(error);
});

function activateBuzzer() {
  console.log('Buzzer activado');
}

function selectAnswer(answer) {
  console.log(`Respuesta ${answer} seleccionada`);
}

function goToPreviousQuestion(page) {
  console.log('Se regreso a la pregunta anterior');
  window.location.href = page;
}

function goToNextQuestion(page) {
  console.log('Se fue a la siguiente pregunta');
  window.location.href = page;
}
