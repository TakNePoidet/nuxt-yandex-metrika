declare global {
	interface Window {
		ym: ((...args: any[]) => void) & { a: any[]; l: number };
	}
}

export interface VisitParameters {
	order_price?: number;
	currency?: string;

	[key: string]: any;
}

export interface UserParameters {
	UserID?: number;

	[key: string]: any;
}

export interface InitParameters {
	accurateTrackBounce?: boolean | number;
	childIframe?: boolean;
	clickmap?: boolean;
	ecommerce?: boolean | string | any[];
	params?: VisitParameters | VisitParameters[];
	userParams?: UserParameters;
	trackHash?: boolean;
	trackLinks?: boolean;
	trustedDomains?: string[];
	type?: number;
	webvisor?: boolean;
	triggerEvent?: boolean;
	sendTitle?: boolean;
}

export interface HitOptions<CTX> {
	callback?: (this: CTX) => void;
	ctx?: CTX;
	params?: VisitParameters;
	referer?: string;
	title?: string;
}

export interface People {
	email?: string;
	phone_number?: string;
	first_name?: string;
	last_name?: string;
	yandex_cid?: number;
	home_address?: {
		street?: string;
		city?: string;
		region?: string;
		postal_code?: number;
		country?: string;
	};
}

export const Methods = {
	Init: 'init',
	AddFileExtension: 'addFileExtension',
	ExtLink: 'extLink',
	File: 'file',
	FirstPartyParams: 'firstPartyParams',
	FirstPartyParamsHashed: 'firstPartyParamsHashed',
	GetClientID: 'getClientID',
	Hit: 'hit',
	NotBounce: 'notBounce',
	Params: 'params',
	ReachGoal: 'reachGoal',
	SetUserID: 'setUserID',
	UserParams: 'userParams'
} as const;

export interface YandexMetrikaApi {
	init: (options: Partial<InitParameters>) => void;
	addFileExtension: (extensions?: string | string[]) => void;
	extLink: <CTX>(url: string, options: Omit<HitOptions<CTX>, 'referer'>) => void;
	file: <CTX>(url: string, options?: HitOptions<CTX>) => void;
	firstPartyParams: (people: People) => void;
	firstPartyParamsHashed: (people: People) => void;
	getClientID: (cb: (clientID: number) => void) => void;
	hit: <CTX>(url: string, options?: HitOptions<CTX>) => void;
	notBounce: <CTX>(options: Pick<HitOptions<CTX>, 'ctx' | 'callback'>) => void;
	params: (params: VisitParameters) => void;
	reachGoal: <CTX>(target: string, params: VisitParameters, callback?: (this: CTX) => void, ctx?: CTX) => void;
	setUserID: (userId: string) => void;
	userParams: (params: UserParameters) => void;
}
