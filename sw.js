const eventsGate = 'https://e.rtblab.online' // #Change to your eventsapp url

self.addEventListener('push', function(event) {
    let notificationData = {};

    try {
      notificationData = event.data.json();

    } catch (e) {
      notificationData = {
        title: 'Default title',
        options: {
          body: 'Default message',
          icon: 'default-icon.png'
        }
      };
    }

  if (notificationData.options.data.campaign_id) {
        fetch(eventsGate + '/events/impression/' + notificationData.options.data.campaign_id, {mode: 'no-cors'})
            .then(r => {
                console.log('[sw] success fetch impcb')
            })
            .catch(err => {
                console.warn('[sw] error fetch impcb', err)
            })
    }  


    event.waitUntil(
      self.registration.showNotification(notificationData.title,  notificationData.options)
    );
  });


  self.addEventListener('notificationclick', function(event) {

    event.notification.close()

    let originalUrl = '/', id = ''

    if (!event.notification.data) {
        console.log('[sw] notificationclick: missed event.notification.data')
        return
    }

    if (event.notification.data.url) {
        let navigationUrl = event.notification.data.url

        event.waitUntil(
            clients.matchAll({ type: 'window' })
                .then(clients => clients.filter(client => client.url === originalUrl))
                .then(matchingClients => {
                    if (matchingClients[0]) {
                        return matchingClients[0].navigate(navigationUrl).then(client => client.focus())
                    }
                    return clients.openWindow(navigationUrl)
                })
        )
    }



 if (event.notification.data.campaign_id) {
        fetch(eventsGate + '/events/click/' + event.notification.data.campaign_id, {mode: 'no-cors'})
            .then(r => {
                console.log('[sw] success fetch clickcb')
            })
            .catch(err => {
                console.warn('[sw] error fetch clickcb', err)
            })
    }  

    });



self.addEventListener('notificationclose', function (event) {

    if (!event.notification.data) {
        console.log('[sw] notificationclose: missed event.notification.data')
        return
    }

    if (event.notification.data.campaign_id) {
        fetch( eventsGate + '/events/close/' + event.notification.data.campaign_id, {mode: 'no-cors'})
        .then(r => {
            console.log('[sw] success fetch closecb')
        })
        .catch(err => {
            console.warn('[sw] error fetch closecb', err)
        })
    }
})
