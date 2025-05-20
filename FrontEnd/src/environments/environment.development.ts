export const environment = {
    apiUrl: 'https://pnttt.dyndns-home.com:5003/api/',
    backend2Url:'https://pnttt.dyndns-home.com:5004/api/',
    msalConfig: {
        auth: {
            clientId: '8cb4473b-fbec-4737-ac14-973ccc04d086',
            authority: 'https://login.microsoftonline.com/f8da0c59-22a8-4891-bc76-7a603e362eac',
            redirectUri: 'https://vs-gate.dei.isep.ipp.pt:11194'
        },
    },
    apiConfig: {
        scopes: ['user.read'],
        uri: 'https://graph.microsoft.com/v1.0/me',
    }
};
