import AbstractSpruceError from '@sprucelabs/error'
import { Log, LogOptions } from './buildLog'

export interface Skill {
	rootDir: string
	/** Source or build depending on running with .local */
	activeDir: string
	hashSpruceDir: string
	registerFeature(code: string, feature: SkillFeature): void
	getFeatureByCode(code: string): SkillFeature
	getFeatures(): SkillFeature[]
	isRunning(): boolean
	isBooted(): boolean
	checkHealth(): Promise<HealthCheckResults>
	buildLog(prefix?: string, options?: LogOptions): Log
	execute(): Promise<void>
	kill(): Promise<void>
}

export interface SkillFeature {
	execute(): Promise<void>
	checkHealth(): Promise<HealthCheckItem>
	isInstalled(): Promise<boolean>
	destroy(): Promise<void>
	isBooted(): boolean
}

export interface SchemaHealthCheckItem extends HealthCheckItem {
	schemas: {
		id: string
		name?: string
		namespace: string
		version?: string
		description?: string
	}[]
}

export interface ErrorHealthCheckItem extends HealthCheckItem {
	errorSchemas: {
		id: string
		name: string
		description?: string
	}[]
}

export interface EventHealthCheckItem extends HealthCheckItem {
	listeners: Omit<EventFeatureListener, 'callback'>[]
	contracts: { fullyQualifiedEventName: string }[]
	events: EventFeatureEvent[]
}

export interface HealthCheckResults {
	skill: HealthCheckItem
	schema?: SchemaHealthCheckItem
	error?: ErrorHealthCheckItem
	event?: EventHealthCheckItem
}

export interface HealthCheckItem {
	status: 'failed' | 'passed'
	errors?: AbstractSpruceError<any>[]
}

export interface EventFeatureListener {
	eventName: string
	eventNamespace: string
	version: string
	callback(skill: Skill): Promise<void>
}

export interface EventFeatureEvent {
	eventName: string
	eventNamespace: string
	version: string
}
