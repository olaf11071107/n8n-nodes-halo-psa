export interface IOperation {
	value: string;
	name: string;
	description: string;
	action: string;
	method: string;
	endpoint: string;
	fields?: IField[];
}

export interface IField {
	name: string;
	type: string;
	required: boolean;
	description: string;
}

export interface IResource {
	value: string;
	name: string;
	description: string;
	operations: IOperation[];
}

export interface ICredentialsDataHaloPsaApi {
	baseUrl: string;
	apiKey: string;
	clientId: string;
	clientSecret: string;
}

export const resources: IResource[] = [
	{
		value: 'actions',
		name: 'Actions',
		description: 'Manage actions in Halo PSA',
		operations: [
			{
				value: 'getActions',
				name: 'Get All Actions',
				description: 'Get a list of all actions',
				action: 'Get all actions',
				method: 'GET',
				endpoint: '/Actions',
			},
			{
				value: 'getAction',
				name: 'Get Action',
				description: 'Get a specific action by ID',
				action: 'Get an action',
				method: 'GET',
				endpoint: '/Actions/{id}',
				fields: [
					{
						name: 'actionId',
						type: 'string',
						required: true,
						description: 'ID of the action',
					},
				],
			},
			{
				value: 'createAction',
				name: 'Create Action',
				description: 'Create a new action',
				action: 'Create an action',
				method: 'POST',
				endpoint: '/Actions',
			},
			{
				value: 'deleteAction',
				name: 'Delete Action',
				description: 'Delete an action',
				action: 'Delete an action',
				method: 'DELETE',
				endpoint: '/Actions/{id}',
				fields: [
					{
						name: 'actionId',
						type: 'string',
						required: true,
						description: 'ID of the action to delete',
					},
				],
			},
			{
				value: 'createActionReaction',
				name: 'Create Action Reaction',
				description: 'Create a reaction to an action',
				action: 'Create an action reaction',
				method: 'POST',
				endpoint: '/Actions/reaction',
			},
			{
				value: 'reviewActions',
				name: 'Review Actions',
				description: 'Review actions',
				action: 'Review actions',
				method: 'POST',
				endpoint: '/Actions/Review',
			},
		],
	},
	{
		value: 'addressbook',
		name: 'Address Book',
		description: 'Manage address book entries in Halo PSA',
		operations: [
			{
				value: 'getAddressBookEntries',
				name: 'Get All Address Book Entries',
				description: 'Get a list of all address book entries',
				action: 'Get all address book entries',
				method: 'GET',
				endpoint: '/Addressbook',
			},
			{
				value: 'getAddressBookEntry',
				name: 'Get Address Book Entry',
				description: 'Get a specific address book entry by ID',
				action: 'Get an address book entry',
				method: 'GET',
				endpoint: '/Addressbook/{id}',
				fields: [
					{
						name: 'addressbookId',
						type: 'string',
						required: true,
						description: 'ID of the address book entry',
					},
				],
			},
			{
				value: 'createAddressBookEntry',
				name: 'Create Address Book Entry',
				description: 'Create a new address book entry',
				action: 'Create an address book entry',
				method: 'POST',
				endpoint: '/Addressbook',
			},
			{
				value: 'deleteAddressBookEntry',
				name: 'Delete Address Book Entry',
				description: 'Delete an address book entry',
				action: 'Delete an address book entry',
				method: 'DELETE',
				endpoint: '/Addressbook/{id}',
				fields: [
					{
						name: 'addressbookId',
						type: 'string',
						required: true,
						description: 'ID of the address book entry to delete',
					},
				],
			},
		],
	},
	{
		value: 'appointment',
		name: 'Appointment',
		description: 'Manage appointments in Halo PSA',
		operations: [
			{
				value: 'getAppointments',
				name: 'Get All Appointments',
				description: 'Get a list of all appointments',
				action: 'Get all appointments',
				method: 'GET',
				endpoint: '/Appointment',
			},
			{
				value: 'getAppointment',
				name: 'Get Appointment',
				description: 'Get a specific appointment by ID',
				action: 'Get an appointment',
				method: 'GET',
				endpoint: '/Appointment/{id}',
				fields: [
					{
						name: 'appointmentId',
						type: 'string',
						required: true,
						description: 'ID of the appointment',
					},
				],
			},
			{
				value: 'createAppointment',
				name: 'Create Appointment',
				description: 'Create a new appointment',
				action: 'Create an appointment',
				method: 'POST',
				endpoint: '/Appointment',
			},
			{
				value: 'deleteAppointment',
				name: 'Delete Appointment',
				description: 'Delete an appointment',
				action: 'Delete an appointment',
				method: 'DELETE',
				endpoint: '/Appointment/{id}',
				fields: [
					{
						name: 'appointmentId',
						type: 'string',
						required: true,
						description: 'ID of the appointment to delete',
					},
				],
			},
		],
	},
	{
		value: 'asset',
		name: 'Asset',
		description: 'Manage assets in Halo PSA',
		operations: [
			{
				value: 'getAssets',
				name: 'Get All Assets',
				description: 'Get a list of all assets',
				action: 'Get all assets',
				method: 'GET',
				endpoint: '/Asset',
			},
			{
				value: 'getAsset',
				name: 'Get Asset',
				description: 'Get a specific asset by ID',
				action: 'Get an asset',
				method: 'GET',
				endpoint: '/Asset/{id}',
				fields: [
					{
						name: 'assetId',
						type: 'string',
						required: true,
						description: 'ID of the asset',
					},
				],
			},
			{
				value: 'createAsset',
				name: 'Create Asset',
				description: 'Create a new asset',
				action: 'Create an asset',
				method: 'POST',
				endpoint: '/Asset',
			},
			{
				value: 'deleteAsset',
				name: 'Delete Asset',
				description: 'Delete an asset',
				action: 'Delete an asset',
				method: 'DELETE',
				endpoint: '/Asset/{id}',
				fields: [
					{
						name: 'assetId',
						type: 'string',
						required: true,
						description: 'ID of the asset to delete',
					},
				],
			},
		],
	},
	{
		value: 'client',
		name: 'Client',
		description: 'Manage clients in Halo PSA',
		operations: [
			{
				value: 'getClients',
				name: 'Get All Clients',
				description: 'Get a list of all clients',
				action: 'Get all clients',
				method: 'GET',
				endpoint: '/Client',
			},
			{
				value: 'getClient',
				name: 'Get Client',
				description: 'Get a specific client by ID',
				action: 'Get a client',
				method: 'GET',
				endpoint: '/Client/{id}',
				fields: [
					{
						name: 'clientId',
						type: 'string',
						required: true,
						description: 'ID of the client',
					},
				],
			},
			{
				value: 'createClient',
				name: 'Create Client',
				description: 'Create a new client',
				action: 'Create a client',
				method: 'POST',
				endpoint: '/Client',
			},
			{
				value: 'deleteClient',
				name: 'Delete Client',
				description: 'Delete a client',
				action: 'Delete a client',
				method: 'DELETE',
				endpoint: '/Client/{id}',
				fields: [
					{
						name: 'clientId',
						type: 'string',
						required: true,
						description: 'ID of the client to delete',
					},
				],
			},
			{
				value: 'updateClientPaymentMethod',
				name: 'Update Client Payment Method',
				description: 'Update a client payment method',
				action: 'Update a client payment method',
				method: 'POST',
				endpoint: '/Client/PaymentMethodUpdate',
			},
		],
	},
	{
		value: 'tickets',
		name: 'Tickets',
		description: 'Manage tickets in Halo PSA',
		operations: [
			{
				value: 'getTickets',
				name: 'Get All Tickets',
				description: 'Get a list of all tickets',
				action: 'Get all tickets',
				method: 'GET',
				endpoint: '/Tickets',
			},
			{
				value: 'getTicket',
				name: 'Get Ticket',
				description: 'Get a specific ticket by ID',
				action: 'Get a ticket',
				method: 'GET',
				endpoint: '/Tickets/{id}',
				fields: [
					{
						name: 'ticketId',
						type: 'string',
						required: true,
						description: 'ID of the ticket',
					},
				],
			},
			{
				value: 'createTicket',
				name: 'Create Ticket',
				description: 'Create a new ticket',
				action: 'Create a ticket',
				method: 'POST',
				endpoint: '/Tickets',
			},
			{
				value: 'deleteTicket',
				name: 'Delete Ticket',
				description: 'Delete a ticket',
				action: 'Delete a ticket',
				method: 'DELETE',
				endpoint: '/Tickets/{id}',
				fields: [
					{
						name: 'ticketId',
						type: 'string',
						required: true,
						description: 'ID of the ticket to delete',
					},
				],
			},
		],
	},
	{
		value: 'supplier',
		name: 'Supplier',
		description: 'Manage suppliers in Halo PSA',
		operations: [
			{
				value: 'getSuppliers',
				name: 'Get All Suppliers',
				description: 'Get a list of all suppliers',
				action: 'Get all suppliers',
				method: 'GET',
				endpoint: '/Supplier',
			},
			{
				value: 'getSupplier',
				name: 'Get Supplier',
				description: 'Get a specific supplier by ID',
				action: 'Get a supplier',
				method: 'GET',
				endpoint: '/Supplier/{id}',
				fields: [
					{
						name: 'supplierId',
						type: 'string',
						required: true,
						description: 'ID of the supplier',
					},
				],
			},
			{
				value: 'createSupplier',
				name: 'Create Supplier',
				description: 'Create a new supplier',
				action: 'Create a supplier',
				method: 'POST',
				endpoint: '/Supplier',
			},
			{
				value: 'deleteSupplier',
				name: 'Delete Supplier',
				description: 'Delete a supplier',
				action: 'Delete a supplier',
				method: 'DELETE',
				endpoint: '/Supplier/{id}',
				fields: [
					{
						name: 'supplierId',
						type: 'string',
						required: true,
						description: 'ID of the supplier to delete',
					},
				],
			},
		],
	},
	{
		value: 'attachment',
		name: 'Attachment',
		description: 'Manage attachments in Halo PSA',
		operations: [
			{
				value: 'getAttachments',
				name: 'Get All Attachments',
				description: 'Get a list of all attachments',
				action: 'Get all attachments',
				method: 'GET',
				endpoint: '/Attachment',
			},
			{
				value: 'getAttachment',
				name: 'Get Attachment',
				description: 'Get a specific attachment by ID',
				action: 'Get an attachment',
				method: 'GET',
				endpoint: '/Attachment/{id}',
				fields: [
					{
						name: 'attachmentId',
						type: 'string',
						required: true,
						description: 'ID of the attachment',
					},
				],
			},
			{
				value: 'createAttachment',
				name: 'Create Attachment',
				description: 'Create a new attachment',
				action: 'Create an attachment',
				method: 'POST',
				endpoint: '/Attachment',
			},
			{
				value: 'deleteAttachment',
				name: 'Delete Attachment',
				description: 'Delete an attachment',
				action: 'Delete an attachment',
				method: 'DELETE',
				endpoint: '/Attachment/{id}',
				fields: [
					{
						name: 'attachmentId',
						type: 'string',
						required: true,
						description: 'ID of the attachment to delete',
					},
				],
			},
			{
				value: 'getAttachmentImage',
				name: 'Get Attachment Image',
				description: 'Get an attachment image',
				action: 'Get an attachment image',
				method: 'GET',
				endpoint: '/Attachment/image',
			},
			{
				value: 'uploadAttachmentImage',
				name: 'Upload Attachment Image',
				description: 'Upload an attachment image',
				action: 'Upload an attachment image',
				method: 'POST',
				endpoint: '/Attachment/image',
			},
			{
				value: 'getS3PresignedURL',
				name: 'Get S3 Presigned URL',
				description: 'Get an S3 presigned URL for attachment upload',
				action: 'Get an S3 presigned URL',
				method: 'POST',
				endpoint: '/Attachment/GetS3PresignedURL',
			},
		],
	},
	{
		value: 'crmNote',
		name: 'CRM Note',
		description: 'Manage CRM notes in Halo PSA',
		operations: [
			{
				value: 'getCRMNotes',
				name: 'Get All CRM Notes',
				description: 'Get a list of all CRM notes',
				action: 'Get all CRM notes',
				method: 'GET',
				endpoint: '/CRMNote',
			},
			{
				value: 'getCRMNote',
				name: 'Get CRM Note',
				description: 'Get a specific CRM note by ID',
				action: 'Get a CRM note',
				method: 'GET',
				endpoint: '/CRMNote/{id}',
				fields: [
					{
						name: 'crmNoteId',
						type: 'string',
						required: true,
						description: 'ID of the CRM note',
					},
				],
			},
			{
				value: 'createCRMNote',
				name: 'Create CRM Note',
				description: 'Create a new CRM note',
				action: 'Create a CRM note',
				method: 'POST',
				endpoint: '/CRMNote',
			},
			{
				value: 'deleteCRMNote',
				name: 'Delete CRM Note',
				description: 'Delete a CRM note',
				action: 'Delete a CRM note',
				method: 'DELETE',
				endpoint: '/CRMNote/{id}',
				fields: [
					{
						name: 'crmNoteId',
						type: 'string',
						required: true,
						description: 'ID of the CRM note to delete',
					},
				],
			},
		],
	},
	{
		value: 'report',
		name: 'Report',
		description: 'Manage reports in Halo PSA',
		operations: [
			{
				value: 'getReports',
				name: 'Get All Reports',
				description: 'Get a list of all reports',
				action: 'Get all reports',
				method: 'GET',
				endpoint: '/Report',
			},
			{
				value: 'getReport',
				name: 'Get Report',
				description: 'Get a specific report by ID',
				action: 'Get a report',
				method: 'GET',
				endpoint: '/Report/{id}',
				fields: [
					{
						name: 'reportId',
						type: 'string',
						required: true,
						description: 'ID of the report',
					},
				],
			},
			{
				value: 'createReport',
				name: 'Create Report',
				description: 'Create a new report',
				action: 'Create a report',
				method: 'POST',
				endpoint: '/Report',
			},
			{
				value: 'createReportPDF',
				name: 'Create Report PDF',
				description: 'Create a PDF from a report',
				action: 'Create a report PDF',
				method: 'POST',
				endpoint: '/Report/createpdf',
			},
		],
	},
	{
		value: 'audit',
		name: 'Audit',
		description: 'Manage audit logs in Halo PSA',
		operations: [
			{
				value: 'getAuditLogs',
				name: 'Get All Audit Logs',
				description: 'Get a list of all audit logs',
				action: 'Get all audit logs',
				method: 'GET',
				endpoint: '/Audit',
			},
		],
	},
	{
		value: 'contract',
		name: 'Contract',
		description: 'Manage contracts in Halo PSA',
		operations: [
			{
				value: 'getSupplierContracts',
				name: 'Get All Supplier Contracts',
				description: 'Get a list of all supplier contracts',
				action: 'Get all supplier contracts',
				method: 'GET',
				endpoint: '/SupplierContract',
			},
			{
				value: 'getSupplierContract',
				name: 'Get Supplier Contract',
				description: 'Get a specific supplier contract by ID',
				action: 'Get a supplier contract',
				method: 'GET',
				endpoint: '/SupplierContract/{id}',
				fields: [
					{
						name: 'contractId',
						type: 'string',
						required: true,
						description: 'ID of the supplier contract',
					},
				],
			},
			{
				value: 'createSupplierContract',
				name: 'Create Supplier Contract',
				description: 'Create a new supplier contract',
				action: 'Create a supplier contract',
				method: 'POST',
				endpoint: '/SupplierContract',
			},
			{
				value: 'getClientContracts',
				name: 'Get All Client Contracts',
				description: 'Get a list of all client contracts',
				action: 'Get all client contracts',
				method: 'GET',
				endpoint: '/ClientContract',
			},
			{
				value: 'getClientContract',
				name: 'Get Client Contract',
				description: 'Get a specific client contract by ID',
				action: 'Get a client contract',
				method: 'GET',
				endpoint: '/ClientContract/{id}',
				fields: [
					{
						name: 'contractId',
						type: 'string',
						required: true,
						description: 'ID of the client contract',
					},
				],
			},
			{
				value: 'createClientContract',
				name: 'Create Client Contract',
				description: 'Create a new client contract',
				action: 'Create a client contract',
				method: 'POST',
				endpoint: '/ClientContract',
			},
		],
	},
	{
		value: 'callLog',
		name: 'Call Log',
		description: 'Manage call logs in Halo PSA',
		operations: [
			{
				value: 'getCallLogs',
				name: 'Get All Call Logs',
				description: 'Get a list of all call logs',
				action: 'Get all call logs',
				method: 'GET',
				endpoint: '/CallLog',
			},
		],
	},
	{
		value: 'certificate',
		name: 'Certificate',
		description: 'Manage certificates in Halo PSA',
		operations: [
			{
				value: 'getCertificates',
				name: 'Get All Certificates',
				description: 'Get a list of all certificates',
				action: 'Get all certificates',
				method: 'GET',
				endpoint: '/Certificate',
			},
		],
	},
	{
		value: 'costCentres',
		name: 'Cost Centres',
		description: 'Manage cost centres in Halo PSA',
		operations: [
			{
				value: 'getCostCentres',
				name: 'Get All Cost Centres',
				description: 'Get a list of all cost centres',
				action: 'Get all cost centres',
				method: 'GET',
				endpoint: '/CostCentres',
			},
		],
	},
];
