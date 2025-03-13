import {
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
	NodePropertyTypes,
	NodeConnectionType,
	IExecuteFunctions,
	IHttpRequestMethods,
	IRequestOptions,
} from 'n8n-workflow';

import {
	resources,
} from './HaloPsaInterfaces';

import { Method } from 'axios';

export class HaloPsa implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Halo PSA',
		name: 'haloPsa',
		icon: 'file:halo-psa.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Consume Halo PSA API',
		defaults: {
			name: 'Halo PSA',
		},
		inputs: ['main'] as NodeConnectionType[],
		outputs: ['main'] as NodeConnectionType[],
		credentials: [
			{
				name: 'haloPsaApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options' as NodePropertyTypes,
				noDataExpression: true,
				options: resources.map(resource => ({
					name: resource.name,
					value: resource.value,
				})),
				default: resources[0].value,
				description: 'Resource to consume',
			},
			// Dynamic operations for each resource
			...resources.map(resource => ({
				displayName: 'Operation',
				name: 'operation',
				type: 'options' as NodePropertyTypes,
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: [
							resource.value,
						],
					},
				},
				options: resource.operations.map((operation) => ({
					name: operation.name,
					value: operation.value,
					description: operation.description,
					action: operation.action,
					method: operation.method,
				})),
				default: resource.operations[0].value,
			})),

			// Add fields for each operation based on the resource
			...resources.flatMap(resource =>
				resource.operations
					.filter(operation => operation.fields && operation.fields.length > 0)
					.flatMap(operation =>
						operation.fields?.map(field => ({
							displayName: field.name,
							name: field.name,
							type: 'string' as NodePropertyTypes,
							default: '',
							required: field.required,
							displayOptions: {
								show: {
									resource: [resource.value],
									operation: [operation.value],
								},
							},
						})) || [],
					),
			),

			// ID fields for GET, PUT, DELETE operations
			...resources.flatMap(resource => 
				resource.operations
					.filter(operation => 
						(operation.method === 'GET' || operation.method === 'DELETE') && 
						operation.endpoint.includes('{id}')
					)
					.map(operation => {
						const paramName = operation.fields?.[0]?.name || `${resource.value.slice(0, -1)}Id`;
						return {
							displayName: `${resource.name.slice(0, -1)} ID`,
							name: paramName,
							type: 'string' as NodePropertyTypes,
							default: '',
							required: true,
							displayOptions: {
								show: {
									resource: [resource.value],
									operation: [operation.value],
								},
							},
						};
					})
			),
			// Additional query parameters for GET operations
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection' as NodePropertyTypes,
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: resources.map(r => r.value),
						operation: resources.flatMap(r => r.operations.filter(o => o.method === 'GET').map(o => o.value)),
					},
				},
				options: [
					{
						displayName: 'Query Parameters',
						name: 'queryParameters',
						type: 'string' as NodePropertyTypes,
						default: '',
						description: 'Query parameters as JSON object',
					},
					{
						displayName: 'Include Details',
						name: 'includedetails',
						type: 'boolean' as NodePropertyTypes,
						default: false,
						description: 'Whether to include additional details in the response',
					},
					{
						displayName: 'Page',
						name: 'page',
						type: 'number' as NodePropertyTypes,
						default: 1,
						description: 'Page number for paginated results',
					},
					{
						displayName: 'Page Size',
						name: 'pagesize',
						type: 'number' as NodePropertyTypes,
						default: 100,
						description: 'Number of records per page',
					},
					{
						displayName: 'Sort By',
						name: 'orderby',
						type: 'string' as NodePropertyTypes,
						default: '',
						description: 'Field to sort by',
					},
					{
						displayName: 'Sort Descending',
						name: 'orderdesc',
						type: 'boolean' as NodePropertyTypes,
						default: false,
						description: 'Whether to sort in descending order',
					},
				],
			},
			// JSON body for POST, PUT operations
			{
				displayName: 'JSON Request Body',
				name: 'jsonRequestBody',
				type: 'json' as NodePropertyTypes,
				default: '',
				displayOptions: {
					show: {
						resource: resources.map(r => r.value),
						operation: resources.flatMap(r => r.operations.filter(o => ['POST', 'PUT', 'PATCH'].includes(o.method)).map(o => o.value)),
					},
				},
				description: 'JSON request body',
			},
			// Simplified fields for common POST operations
			{
				displayName: 'Simple Fields',
				name: 'simpleFields',
				type: 'collection' as NodePropertyTypes,
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['tickets'],
						operation: ['createTicket'],
					},
				},
				options: [
					{
						displayName: 'Summary',
						name: 'summary',
						type: 'string' as NodePropertyTypes,
						default: '',
						description: 'Summary of the ticket',
					},
					{
						displayName: 'Details',
						name: 'details',
						type: 'string' as NodePropertyTypes,
						default: '',
						description: 'Details of the ticket',
					},
					{
						displayName: 'Client ID',
						name: 'client_id',
						type: 'number' as NodePropertyTypes,
						default: 0,
						description: 'ID of the client',
					},
					{
						displayName: 'Site ID',
						name: 'site_id',
						type: 'number' as NodePropertyTypes,
						default: 0,
						description: 'ID of the site',
					},
					{
						displayName: 'Agent ID',
						name: 'agent_id',
						type: 'number' as NodePropertyTypes,
						default: 0,
						description: 'ID of the assigned agent',
					},
					{
						displayName: 'Status ID',
						name: 'status_id',
						type: 'number' as NodePropertyTypes,
						default: 0,
						description: 'ID of the status',
					},
					{
						displayName: 'Priority ID',
						name: 'priority_id',
						type: 'number' as NodePropertyTypes,
						default: 0,
						description: 'ID of the priority',
					},
				],
			},
			{
				displayName: 'Simple Fields',
				name: 'simpleFields',
				type: 'collection' as NodePropertyTypes,
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['client'],
						operation: ['createClient'],
					},
				},
				options: [
					{
						displayName: 'Name',
						name: 'name',
						type: 'string' as NodePropertyTypes,
						default: '',
						description: 'Name of the client',
					},
					{
						displayName: 'Email',
						name: 'email',
						type: 'string' as NodePropertyTypes,
						default: '',
						description: 'Email of the client',
					},
					{
						displayName: 'Phone',
						name: 'phone',
						type: 'string' as NodePropertyTypes,
						default: '',
						description: 'Phone number of the client',
					},
					{
						displayName: 'Address',
						name: 'address',
						type: 'string' as NodePropertyTypes,
						default: '',
						description: 'Address of the client',
					},
				],
			},
			{
				displayName: 'Simple Fields',
				name: 'simpleFields',
				type: 'collection' as NodePropertyTypes,
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['actions'],
						operation: ['createAction'],
					},
				},
				options: [
					{
						displayName: 'Description',
						name: 'description',
						type: 'string' as NodePropertyTypes,
						default: '',
						description: 'Description of the action',
					},
					{
						displayName: 'Due Date',
						name: 'duedate',
						type: 'dateTime',
						default: '',
						description: 'Due date of the action',
					},
					{
						displayName: 'Assigned User ID',
						name: 'assigned_user_id',
						type: 'number' as NodePropertyTypes,
						default: 0,
						description: 'ID of the user assigned to the action',
					},
					{
						displayName: 'Status ID',
						name: 'status_id',
						type: 'number' as NodePropertyTypes,
						default: 0,
						description: 'ID of the action status',
					},
					{
						displayName: 'Priority ID',
						name: 'priority_id',
						type: 'number' as NodePropertyTypes,
						default: 0,
						description: 'ID of the action priority',
					},
				],
			},
			{
				displayName: 'Simple Fields',
				name: 'simpleFields',
				type: 'collection' as NodePropertyTypes,
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['appointment'],
						operation: ['createAppointment'],
					},
				},
				options: [
					{
						displayName: 'Summary',
						name: 'summary',
						type: 'string' as NodePropertyTypes,
						default: '',
						description: 'Summary of the appointment',
					},
					{
						displayName: 'Details',
						name: 'details',
						type: 'string' as NodePropertyTypes,
						default: '',
						description: 'Details of the appointment',
					},
					{
						displayName: 'Start Date',
						name: 'start_date',
						type: 'dateTime',
						default: '',
						description: 'Start date and time of the appointment',
					},
					{
						displayName: 'End Date',
						name: 'end_date',
						type: 'dateTime',
						default: '',
						description: 'End date and time of the appointment',
					},
					{
						displayName: 'User ID',
						name: 'user_id',
						type: 'number' as NodePropertyTypes,
						default: 0,
						description: 'ID of the user for the appointment',
					},
				],
			},
			{
				displayName: 'Simple Fields',
				name: 'simpleFields',
				type: 'collection' as NodePropertyTypes,
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['asset'],
						operation: ['createAsset'],
					},
				},
				options: [
					{
						displayName: 'Name',
						name: 'name',
						type: 'string' as NodePropertyTypes,
						default: '',
						description: 'Name of the asset',
					},
					{
						displayName: 'Description',
						name: 'description',
						type: 'string' as NodePropertyTypes,
						default: '',
						description: 'Description of the asset',
					},
					{
						displayName: 'Client ID',
						name: 'client_id',
						type: 'number' as NodePropertyTypes,
						default: 0,
						description: 'ID of the client who owns the asset',
					},
					{
						displayName: 'Site ID',
						name: 'site_id',
						type: 'number' as NodePropertyTypes,
						default: 0,
						description: 'ID of the site where the asset is located',
					},
					{
						displayName: 'Asset Type ID',
						name: 'asset_type_id',
						type: 'number' as NodePropertyTypes,
						default: 0,
						description: 'ID of the asset type',
					},
					{
						displayName: 'Status ID',
						name: 'status_id',
						type: 'number' as NodePropertyTypes,
						default: 0,
						description: 'ID of the asset status',
					},
				],
			},
			{
				displayName: 'Simple Fields',
				name: 'simpleFields',
				type: 'collection' as NodePropertyTypes,
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['supplier'],
						operation: ['createSupplier'],
					},
				},
				options: [
					{
						displayName: 'Name',
						name: 'name',
						type: 'string' as NodePropertyTypes,
						default: '',
						description: 'Name of the supplier',
					},
					{
						displayName: 'Email',
						name: 'email',
						type: 'string' as NodePropertyTypes,
						default: '',
						description: 'Email of the supplier',
					},
					{
						displayName: 'Phone',
						name: 'phone',
						type: 'string' as NodePropertyTypes,
						default: '',
						description: 'Phone number of the supplier',
					},
					{
						displayName: 'Address',
						name: 'address',
						type: 'string' as NodePropertyTypes,
						default: '',
						description: 'Address of the supplier',
					},
					{
						displayName: 'Contact Name',
						name: 'contact_name',
						type: 'string' as NodePropertyTypes,
						default: '',
						description: 'Name of the primary contact',
					},
				],
			},
			{
				displayName: 'Simple Fields',
				name: 'simpleFields',
				type: 'collection' as NodePropertyTypes,
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['crmNote'],
						operation: ['createCRMNote'],
					},
				},
				options: [
					{
						displayName: 'Note',
						name: 'note',
						type: 'string' as NodePropertyTypes,
						default: '',
						description: 'Content of the CRM note',
					},
					{
						displayName: 'Client ID',
						name: 'client_id',
						type: 'number' as NodePropertyTypes,
						default: 0,
						description: 'ID of the client associated with the note',
					},
					{
						displayName: 'User ID',
						name: 'user_id',
						type: 'number' as NodePropertyTypes,
						default: 0,
						description: 'ID of the user creating the note',
					},
				],
			},
			{
				displayName: 'Simple Fields',
				name: 'simpleFields',
				type: 'collection' as NodePropertyTypes,
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['attachment'],
						operation: ['createAttachment'],
					},
				},
				options: [
					{
						displayName: 'Name',
						name: 'name',
						type: 'string' as NodePropertyTypes,
						default: '',
						description: 'Name of the attachment',
					},
					{
						displayName: 'File Content (Base64)',
						name: 'content',
						type: 'string' as NodePropertyTypes,
						default: '',
						description: 'Base64-encoded content of the file',
					},
					{
						displayName: 'MIME Type',
						name: 'mime_type',
						type: 'string' as NodePropertyTypes,
						default: '',
						description: 'MIME type of the attachment',
					},
					{
						displayName: 'Related Record ID',
						name: 'record_id',
						type: 'number' as NodePropertyTypes,
						default: 0,
						description: 'ID of the record to attach this file to',
					},
					{
						displayName: 'Record Type',
						name: 'record_type',
						type: 'options',
						options: [
							{
								name: 'Ticket',
								value: 'ticket',
							},
							{
								name: 'Client',
								value: 'client',
							},
							{
								name: 'Asset',
								value: 'asset',
							},
							{
								name: 'Supplier',
								value: 'supplier',
							},
						],
						default: 'ticket',
						description: 'Type of record to attach this file to',
					},
				],
			},
			{
				displayName: 'Binary Property',
				name: 'binaryPropertyName',
				type: 'string' as NodePropertyTypes,
				default: 'data',
				required: true,
				displayOptions: {
					show: {
						resource: ['attachment'],
						operation: ['createAttachment', 'uploadAttachmentImage'],
					},
				},
				description: 'Name of the binary property containing the data for the file to be uploaded',
			},
			{
				displayName: 'Simple Fields',
				name: 'simpleFields',
				type: 'collection' as NodePropertyTypes,
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['attachment'],
						operation: ['uploadAttachmentImage'],
					},
				},
				options: [
					{
						displayName: 'Name',
						name: 'name',
						type: 'string' as NodePropertyTypes,
						default: '',
						description: 'Name of the image attachment',
					},
					{
						displayName: 'Related Record ID',
						name: 'record_id',
						type: 'number' as NodePropertyTypes,
						default: 0,
						description: 'ID of the record to attach this image to',
					},
					{
						displayName: 'Record Type',
						name: 'record_type',
						type: 'options',
						options: [
							{
								name: 'Ticket',
								value: 'ticket',
							},
							{
								name: 'Client',
								value: 'client',
							},
							{
								name: 'Asset',
								value: 'asset',
							},
							{
								name: 'Supplier',
								value: 'supplier',
							},
						],
						default: 'ticket',
						description: 'Type of record to attach this image to',
					},
				],
			},
			{
				displayName: 'Simple Fields',
				name: 'simpleFields',
				type: 'collection' as NodePropertyTypes,
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['attachment'],
						operation: ['getS3PresignedURL'],
					},
				},
				options: [
					{
						displayName: 'File Name',
						name: 'filename',
						type: 'string' as NodePropertyTypes,
						default: '',
						description: 'Name of the file to upload',
					},
					{
						displayName: 'MIME Type',
						name: 'mime_type',
						type: 'string' as NodePropertyTypes,
						default: '',
						description: 'MIME type of the file',
					},
					{
						displayName: 'Record ID',
						name: 'record_id',
						type: 'number' as NodePropertyTypes,
						default: 0,
						description: 'ID of the record to attach this file to',
					},
					{
						displayName: 'Record Type',
						name: 'record_type',
						type: 'options',
						options: [
							{
								name: 'Ticket',
								value: 'ticket',
							},
							{
								name: 'Client',
								value: 'client',
							},
							{
								name: 'Asset',
								value: 'asset',
							},
							{
								name: 'Supplier',
								value: 'supplier',
							},
						],
						default: 'ticket',
						description: 'Type of record to attach this file to',
					},
				],
			},
			{
				displayName: 'Simple Fields',
				name: 'simpleFields',
				type: 'collection' as NodePropertyTypes,
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['attachment'],
						operation: ['getAttachmentImage'],
					},
				},
				options: [
					{
						displayName: 'Attachment ID',
						name: 'id',
						type: 'number' as NodePropertyTypes,
						default: 0,
						description: 'ID of the attachment to get the image for',
					},
					{
						displayName: 'Width',
						name: 'width',
						type: 'number' as NodePropertyTypes,
						default: 0,
						description: 'Width of the image (0 for original size)',
					},
					{
						displayName: 'Height',
						name: 'height',
						type: 'number' as NodePropertyTypes,
						default: 0,
						description: 'Height of the image (0 for original size)',
					},
				],
			},
			{
				displayName: 'Simple Fields',
				name: 'simpleFields',
				type: 'collection' as NodePropertyTypes,
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['report'],
						operation: ['createReport'],
					},
				},
				options: [
					{
						displayName: 'Name',
						name: 'name',
						type: 'string' as NodePropertyTypes,
						default: '',
						description: 'Name of the report',
					},
					{
						displayName: 'Description',
						name: 'description',
						type: 'string' as NodePropertyTypes,
						default: '',
						description: 'Description of the report',
					},
					{
						displayName: 'Query',
						name: 'query',
						type: 'string' as NodePropertyTypes,
						default: '',
						description: 'SQL query for the report',
					},
				],
			},
			{
				displayName: 'Simple Fields',
				name: 'simpleFields',
				type: 'collection' as NodePropertyTypes,
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['addressbook'],
						operation: ['createAddressBookEntry'],
					},
				},
				options: [
					{
						displayName: 'First Name',
						name: 'first_name',
						type: 'string' as NodePropertyTypes,
						default: '',
						description: 'First name of the contact',
					},
					{
						displayName: 'Last Name',
						name: 'last_name',
						type: 'string' as NodePropertyTypes,
						default: '',
						description: 'Last name of the contact',
					},
					{
						displayName: 'Email',
						name: 'email',
						type: 'string' as NodePropertyTypes,
						default: '',
						description: 'Email address of the contact',
					},
					{
						displayName: 'Phone',
						name: 'phone',
						type: 'string' as NodePropertyTypes,
						default: '',
						description: 'Phone number of the contact',
					},
					{
						displayName: 'Mobile',
						name: 'mobile',
						type: 'string' as NodePropertyTypes,
						default: '',
						description: 'Mobile number of the contact',
					},
					{
						displayName: 'Client ID',
						name: 'client_id',
						type: 'number' as NodePropertyTypes,
						default: 0,
						description: 'ID of the client associated with this contact',
					},
				],
			},
			{
				displayName: 'Simple Fields',
				name: 'simpleFields',
				type: 'collection' as NodePropertyTypes,
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['contract'],
						operation: ['createClientContract'],
					},
				},
				options: [
					{
						displayName: 'Name',
						name: 'name',
						type: 'string' as NodePropertyTypes,
						default: '',
						description: 'Name of the contract',
					},
					{
						displayName: 'Client ID',
						name: 'client_id',
						type: 'number' as NodePropertyTypes,
						default: 0,
						description: 'ID of the client for this contract',
					},
					{
						displayName: 'Start Date',
						name: 'start_date',
						type: 'dateTime',
						default: '',
						description: 'Start date of the contract',
					},
					{
						displayName: 'End Date',
						name: 'end_date',
						type: 'dateTime',
						default: '',
						description: 'End date of the contract',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'number' as NodePropertyTypes,
						default: 0,
						description: 'Value of the contract',
					},
					{
						displayName: 'Status ID',
						name: 'status_id',
						type: 'number' as NodePropertyTypes,
						default: 0,
						description: 'ID of the contract status',
					},
					{
						displayName: 'Description',
						name: 'description',
						type: 'string' as NodePropertyTypes,
						default: '',
						description: 'Description of the contract',
					},
				],
			},
			{
				displayName: 'Simple Fields',
				name: 'simpleFields',
				type: 'collection' as NodePropertyTypes,
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['contract'],
						operation: ['createSupplierContract'],
					},
				},
				options: [
					{
						displayName: 'Name',
						name: 'name',
						type: 'string' as NodePropertyTypes,
						default: '',
						description: 'Name of the contract',
					},
					{
						displayName: 'Supplier ID',
						name: 'supplier_id',
						type: 'number' as NodePropertyTypes,
						default: 0,
						description: 'ID of the supplier for this contract',
					},
					{
						displayName: 'Start Date',
						name: 'start_date',
						type: 'dateTime',
						default: '',
						description: 'Start date of the contract',
					},
					{
						displayName: 'End Date',
						name: 'end_date',
						type: 'dateTime',
						default: '',
						description: 'End date of the contract',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'number' as NodePropertyTypes,
						default: 0,
						description: 'Value of the contract',
					},
					{
						displayName: 'Status ID',
						name: 'status_id',
						type: 'number' as NodePropertyTypes,
						default: 0,
						description: 'ID of the contract status',
					},
					{
						displayName: 'Description',
						name: 'description',
						type: 'string' as NodePropertyTypes,
						default: '',
						description: 'Description of the contract',
					},
				],
			},
			{
				displayName: 'Filters',
				name: 'simpleFields',
				type: 'collection' as NodePropertyTypes,
				placeholder: 'Add Filter',
				default: {},
				displayOptions: {
					show: {
						resource: ['audit'],
						operation: ['getAuditLogs'],
					},
				},
				options: [
					{
						displayName: 'Start Date',
						name: 'start_date',
						type: 'dateTime',
						default: '',
						description: 'Filter logs from this date',
					},
					{
						displayName: 'End Date',
						name: 'end_date',
						type: 'dateTime',
						default: '',
						description: 'Filter logs until this date',
					},
					{
						displayName: 'User ID',
						name: 'user_id',
						type: 'number' as NodePropertyTypes,
						default: 0,
						description: 'Filter logs by user ID',
					},
					{
						displayName: 'Record Type',
						name: 'record_type',
						type: 'options',
						options: [
							{
								name: 'Ticket',
								value: 'ticket',
							},
							{
								name: 'Client',
								value: 'client',
							},
							{
								name: 'Asset',
								value: 'asset',
							},
							{
								name: 'Supplier',
								value: 'supplier',
							},
							{
								name: 'Contract',
								value: 'contract',
							},
						],
						default: '',
						description: 'Filter logs by record type',
					},
					{
						displayName: 'Record ID',
						name: 'record_id',
						type: 'number' as NodePropertyTypes,
						default: 0,
						description: 'Filter logs by record ID',
					},
				],
			},
			{
				displayName: 'Filters',
				name: 'simpleFields',
				type: 'collection' as NodePropertyTypes,
				placeholder: 'Add Filter',
				default: {},
				displayOptions: {
					show: {
						resource: ['callLog'],
						operation: ['getCallLogs'],
					},
				},
				options: [
					{
						displayName: 'Start Date',
						name: 'start_date',
						type: 'dateTime',
						default: '',
						description: 'Filter call logs from this date',
					},
					{
						displayName: 'End Date',
						name: 'end_date',
						type: 'dateTime',
						default: '',
						description: 'Filter call logs until this date',
					},
					{
						displayName: 'User ID',
						name: 'user_id',
						type: 'number' as NodePropertyTypes,
						default: 0,
						description: 'Filter call logs by user ID',
					},
					{
						displayName: 'Client ID',
						name: 'client_id',
						type: 'number' as NodePropertyTypes,
						default: 0,
						description: 'Filter call logs by client ID',
					},
					{
						displayName: 'Ticket ID',
						name: 'ticket_id',
						type: 'number' as NodePropertyTypes,
						default: 0,
						description: 'Filter call logs by ticket ID',
					},
				],
			},
			{
				displayName: 'Filters',
				name: 'simpleFields',
				type: 'collection' as NodePropertyTypes,
				placeholder: 'Add Filter',
				default: {},
				displayOptions: {
					show: {
						resource: ['certificate'],
						operation: ['getCertificates'],
					},
				},
				options: [
					{
						displayName: 'Client ID',
						name: 'client_id',
						type: 'number' as NodePropertyTypes,
						default: 0,
						description: 'Filter certificates by client ID',
					},
					{
						displayName: 'Asset ID',
						name: 'asset_id',
						type: 'number' as NodePropertyTypes,
						default: 0,
						description: 'Filter certificates by asset ID',
					},
					{
						displayName: 'Status',
						name: 'status',
						type: 'options',
						options: [
							{
								name: 'Active',
								value: 'active',
							},
							{
								name: 'Expired',
								value: 'expired',
							},
							{
								name: 'Revoked',
								value: 'revoked',
							},
						],
						default: '',
						description: 'Filter certificates by status',
					},
					{
						displayName: 'Expiry Before',
						name: 'expiry_before',
						type: 'dateTime',
						default: '',
						description: 'Filter certificates expiring before this date',
					},
					{
						displayName: 'Expiry After',
						name: 'expiry_after',
						type: 'dateTime',
						default: '',
						description: 'Filter certificates expiring after this date',
					},
				],
			},
			{
				displayName: 'Filters',
				name: 'simpleFields',
				type: 'collection' as NodePropertyTypes,
				placeholder: 'Add Filter',
				default: {},
				displayOptions: {
					show: {
						resource: ['costCentres'],
						operation: ['getCostCentres'],
					},
				},
				options: [
					{
						displayName: 'Active Only',
						name: 'active_only',
						type: 'boolean' as NodePropertyTypes,
						default: true,
						description: 'Whether to return only active cost centres',
					},
					{
						displayName: 'Name',
						name: 'name',
						type: 'string' as NodePropertyTypes,
						default: '',
						description: 'Filter cost centres by name',
					},
					{
						displayName: 'Code',
						name: 'code',
						type: 'string' as NodePropertyTypes,
						default: '',
						description: 'Filter cost centres by code',
					},
				],
			},
			{
				displayName: 'Simple Fields',
				name: 'simpleFields',
				type: 'collection' as NodePropertyTypes,
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['client'],
						operation: ['updateClientPaymentMethod'],
					},
				},
				options: [
					{
						displayName: 'Client ID',
						name: 'client_id',
						type: 'number' as NodePropertyTypes,
						default: 0,
						description: 'ID of the client to update payment method for',
					},
					{
						displayName: 'Payment Method ID',
						name: 'payment_method_id',
						type: 'number' as NodePropertyTypes,
						default: 0,
						description: 'ID of the payment method to set',
					},
					{
						displayName: 'Is Default',
						name: 'is_default',
						type: 'boolean' as NodePropertyTypes,
						default: true,
						description: 'Whether this payment method should be the default',
					},
				],
			},
			{
				displayName: 'Filters',
				name: 'simpleFields',
				type: 'collection' as NodePropertyTypes,
				placeholder: 'Add Filter',
				default: {},
				displayOptions: {
					show: {
						resource: ['tickets'],
						operation: ['getTickets'],
					},
				},
				options: [
					{
						displayName: 'Client ID',
						name: 'client_id',
						type: 'number' as NodePropertyTypes,
						default: 0,
						description: 'Filter tickets by client ID',
					},
					{
						displayName: 'Status ID',
						name: 'status_id',
						type: 'number' as NodePropertyTypes,
						default: 0,
						description: 'Filter tickets by status ID',
					},
					{
						displayName: 'Agent ID',
						name: 'agent_id',
						type: 'number' as NodePropertyTypes,
						default: 0,
						description: 'Filter tickets by assigned agent ID',
					},
					{
						displayName: 'Team ID',
						name: 'team_id',
						type: 'number' as NodePropertyTypes,
						default: 0,
						description: 'Filter tickets by team ID',
					},
					{
						displayName: 'Priority ID',
						name: 'priority_id',
						type: 'number' as NodePropertyTypes,
						default: 0,
						description: 'Filter tickets by priority ID',
					},
					{
						displayName: 'Created After',
						name: 'created_after',
						type: 'dateTime',
						default: '',
						description: 'Filter tickets created after this date',
					},
					{
						displayName: 'Created Before',
						name: 'created_before',
						type: 'dateTime',
						default: '',
						description: 'Filter tickets created before this date',
					},
					{
						displayName: 'Updated After',
						name: 'updated_after',
						type: 'dateTime',
						default: '',
						description: 'Filter tickets updated after this date',
					},
					{
						displayName: 'Updated Before',
						name: 'updated_before',
						type: 'dateTime',
						default: '',
						description: 'Filter tickets updated before this date',
					},
				],
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection' as NodePropertyTypes,
				placeholder: 'Add Field',
				default: {},
				options: [
					{
						displayName: 'Include Details',
						name: 'includedetails',
						type: 'boolean' as NodePropertyTypes,
						default: false,
						description: 'Whether to include additional details in the response',
					},
					{
						displayName: 'Page',
						name: 'page',
						type: 'number' as NodePropertyTypes,
						default: 1,
						description: 'Page number for paginated results',
					},
					{
						displayName: 'Page Size',
						name: 'pagesize',
						type: 'number' as NodePropertyTypes,
						default: 100,
						description: 'Number of results per page',
					},
					{
						displayName: 'Order By',
						name: 'orderby',
						type: 'string' as NodePropertyTypes,
						default: '',
						description: 'Field to order results by',
					},
					{
						displayName: 'Order Descending',
						name: 'orderdesc',
						type: 'boolean' as NodePropertyTypes,
						default: false,
						description: 'Whether to order results in descending order',
					},
					{
						displayName: 'Custom Query Parameters',
						name: 'customQueryParameters',
						type: 'string' as NodePropertyTypes,
						default: '',
						description: 'Additional query parameters as JSON object',
					},
					{
						displayName: 'Custom Body Parameters',
						name: 'customBodyParameters',
						type: 'string' as NodePropertyTypes,
						default: '',
						description: 'Additional body parameters as JSON object (for POST, PUT, PATCH operations)',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		let resource: string;
		let operation: string;
		let endpoint: string;
		let method: IHttpRequestMethods;

		// Get credentials for API
		const credentials = await this.getCredentials('haloPsaApi') as IDataObject;
		
		if (!credentials) {
			throw new NodeOperationError(this.getNode(), 'No credentials returned!');
		}

		const baseUrl = credentials.baseUrl as string;
		const tenant = credentials.tenant as string;
		const clientId = credentials.clientId as string;
		const clientSecret = credentials.clientSecret as string;

		// Iterate through input items
		for (let i = 0; i < items.length; i++) {
			try {
				// Get resource and operation
				resource = this.getNodeParameter('resource', i) as string;
				operation = this.getNodeParameter('operation', i) as string;

				// Find operation details from resources
				const resourceObject = resources.find(r => r.value === resource);
				if (!resourceObject) {
					throw new NodeOperationError(this.getNode(), `Resource ${resource} not found`);
				}

				const operationObject = resourceObject.operations.find(o => o.value === operation);
				if (!operationObject) {
					throw new NodeOperationError(this.getNode(), `Operation ${operation} not found for resource ${resource}`);
				}

				// Get endpoint and method
				endpoint = operationObject.endpoint;
				method = operationObject.method as IHttpRequestMethods;

				// Replace path parameters in endpoint
				if (endpoint.includes('{')) {
					// Find all parameters in the endpoint
					const pathParams = endpoint.match(/{([^}]+)}/g);
					if (pathParams) {
						for (const param of pathParams) {
							const paramName = param.replace('{', '').replace('}', '');
							const paramValue = this.getNodeParameter(paramName, i) as string;
							endpoint = endpoint.replace(param, paramValue);
						}
					}
				}

				// Handle query parameters for GET operations
				let qs: IDataObject = {};
				if (method === 'GET') {
					// Add additional fields
					const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
					qs = { ...qs, ...additionalFields };

					// Add custom query parameters if specified
					const jsonParameters = this.getNodeParameter('jsonParameters', i, false) as boolean;
					if (jsonParameters) {
						const queryParameters = this.getNodeParameter('queryParameters', i, '') as string | IDataObject;
						if (queryParameters) {
							if (typeof queryParameters === 'string') {
								qs = { ...qs, ...JSON.parse(queryParameters) };
							} else {
								qs = { ...qs, ...queryParameters };
							}
						}
					}
				}

				// Handle body for POST, PUT, PATCH operations
				let body: IDataObject = {};
				if (['POST', 'PUT', 'PATCH'].includes(method)) {
					const jsonRequestBody = this.getNodeParameter('jsonRequestBody', i, '') as string;
					if (jsonRequestBody) {
						body = JSON.parse(jsonRequestBody);
					}
				}
				
				// Create options for request
				let options: IRequestOptions;
				
				// Special handling for attachments - process binary data
				if (resource === 'attachment' && (operation === 'createAttachment' || operation === 'uploadAttachmentImage')) {
					const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
					
					// Safely check for binary data
					const itemBinaryData = items[i].binary;
					const binaryData = itemBinaryData && binaryPropertyName in itemBinaryData 
						? itemBinaryData[binaryPropertyName] 
						: undefined;
					
					if (binaryData) {
						const dataBuffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
						
						// Set up form data
						const formData = {
							file: {
								value: dataBuffer,
								options: {
									filename: binaryData.fileName || 'file',
									contentType: binaryData.mimeType,
								},
							},
						};
						
						// Create options with form data
						options = {
							method,
							url: `${baseUrl}${endpoint}`,
							qs,
							headers: {
								'X-Tenant': tenant,
								'X-HaloPSA-ClientId': clientId,
								'X-HaloPSA-ClientSecret': clientSecret,
							},
							formData,
							json: true,
						};
					} else {
						// No binary data, use regular options
						options = {
							method,
							url: `${baseUrl}${endpoint}`,
							qs,
							headers: {
								'Content-Type': 'application/json',
								'X-Tenant': tenant,
								'X-HaloPSA-ClientId': clientId,
								'X-HaloPSA-ClientSecret': clientSecret,
							},
							body,
							json: true,
						};
					}
				} else {
					// For all other operations
					options = {
						method,
						url: `${baseUrl}${endpoint}`,
						qs,
						headers: {
							'Content-Type': 'application/json',
							'X-Tenant': tenant,
							'X-HaloPSA-ClientId': clientId,
							'X-HaloPSA-ClientSecret': clientSecret,
						},
						json: true,
					};
					
					// Add body for POST, PUT, PATCH operations
					if (['POST', 'PUT', 'PATCH'].includes(method)) {
						options.body = body;
					}
				}
				
				// Execute request
				try {
					const response = await this.helpers.request(options);
					returnData.push({
						json: response,
						pairedItem: { item: i },
					});
				} catch (error) {
					if (this.continueOnFail()) {
						returnData.push({
							json: { error: error.message },
							pairedItem: { item: i },
						});
						continue;
					}
					throw error;
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: error.message },
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
