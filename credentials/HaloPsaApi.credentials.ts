import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class HaloPsaApi implements ICredentialType {
	name = 'haloPsaApi';
	displayName = 'Halo PSA API';
	documentationUrl = 'https://halopsa.com/documentation/api/';
	properties: INodeProperties[] = [
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: '',
			required: true,
			placeholder: 'https://your-instance.halopsa.com',
			description: 'The URL of your Halo PSA instance',
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'The API key for authentication',
		},
		{
			displayName: 'Client ID',
			name: 'clientId',
			type: 'string',
			default: '',
			required: true,
			description: 'The client ID for authentication',
		},
		{
			displayName: 'Client Secret',
			name: 'clientSecret',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'The client secret for authentication',
		},
	];
}
