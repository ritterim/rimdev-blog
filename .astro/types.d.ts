declare module 'astro:content' {
	interface Render {
		'.md': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	export { z } from 'astro/zod';

	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	// This needs to be in sync with ImageMetadata
	export type ImageFunction = () => import('astro/zod').ZodObject<{
		src: import('astro/zod').ZodString;
		width: import('astro/zod').ZodNumber;
		height: import('astro/zod').ZodNumber;
		format: import('astro/zod').ZodUnion<
			[
				import('astro/zod').ZodLiteral<'png'>,
				import('astro/zod').ZodLiteral<'jpg'>,
				import('astro/zod').ZodLiteral<'jpeg'>,
				import('astro/zod').ZodLiteral<'tiff'>,
				import('astro/zod').ZodLiteral<'webp'>,
				import('astro/zod').ZodLiteral<'gif'>,
				import('astro/zod').ZodLiteral<'svg'>,
				import('astro/zod').ZodLiteral<'avif'>,
			]
		>;
	}>;

	type BaseSchemaWithoutEffects =
		| import('astro/zod').AnyZodObject
		| import('astro/zod').ZodUnion<[BaseSchemaWithoutEffects, ...BaseSchemaWithoutEffects[]]>
		| import('astro/zod').ZodDiscriminatedUnion<string, import('astro/zod').AnyZodObject[]>
		| import('astro/zod').ZodIntersection<BaseSchemaWithoutEffects, BaseSchemaWithoutEffects>;

	type BaseSchema =
		| BaseSchemaWithoutEffects
		| import('astro/zod').ZodEffects<BaseSchemaWithoutEffects>;

	export type SchemaContext = { image: ImageFunction };

	type DataCollectionConfig<S extends BaseSchema> = {
		type: 'data';
		schema?: S | ((context: SchemaContext) => S);
	};

	type ContentCollectionConfig<S extends BaseSchema> = {
		type?: 'content';
		schema?: S | ((context: SchemaContext) => S);
	};

	type CollectionConfig<S> = ContentCollectionConfig<S> | DataCollectionConfig<S>;

	export function defineCollection<S extends BaseSchema>(
		input: CollectionConfig<S>
	): CollectionConfig<S>;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[]
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[]
	): Promise<CollectionEntry<C>[]>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
			  }
			: {
					collection: C;
					id: keyof DataEntryMap[C];
			  }
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"authors": {
"andrew-rady.md": {
	id: "andrew-rady.md";
  slug: "andrew-rady";
  body: string;
  collection: "authors";
  data: any
} & { render(): Render[".md"] };
"austin-asbury.md": {
	id: "austin-asbury.md";
  slug: "austin-asbury";
  body: string;
  collection: "authors";
  data: any
} & { render(): Render[".md"] };
"bill-boga.md": {
	id: "bill-boga.md";
  slug: "bill-boga";
  body: string;
  collection: "authors";
  data: any
} & { render(): Render[".md"] };
"chad-peters.md": {
	id: "chad-peters.md";
  slug: "chad-peters";
  body: string;
  collection: "authors";
  data: any
} & { render(): Render[".md"] };
"cheng-yang.md": {
	id: "cheng-yang.md";
  slug: "cheng-yang";
  body: string;
  collection: "authors";
  data: any
} & { render(): Render[".md"] };
"chidozie-oragwu.md": {
	id: "chidozie-oragwu.md";
  slug: "chidozie-oragwu";
  body: string;
  collection: "authors";
  data: any
} & { render(): Render[".md"] };
"jaime-jones.md": {
	id: "jaime-jones.md";
  slug: "jaime-jones";
  body: string;
  collection: "authors";
  data: any
} & { render(): Render[".md"] };
"john-vicari.md": {
	id: "john-vicari.md";
  slug: "john-vicari";
  body: string;
  collection: "authors";
  data: any
} & { render(): Render[".md"] };
"ken-dale.md": {
	id: "ken-dale.md";
  slug: "ken-dale";
  body: string;
  collection: "authors";
  data: any
} & { render(): Render[".md"] };
"ken-earl.md": {
	id: "ken-earl.md";
  slug: "ken-earl";
  body: string;
  collection: "authors";
  data: any
} & { render(): Render[".md"] };
"kevin-hougasian.md": {
	id: "kevin-hougasian.md";
  slug: "kevin-hougasian";
  body: string;
  collection: "authors";
  data: any
} & { render(): Render[".md"] };
"khalid-abuhakmeh.md": {
	id: "khalid-abuhakmeh.md";
  slug: "khalid-abuhakmeh";
  body: string;
  collection: "authors";
  data: any
} & { render(): Render[".md"] };
"natasha-kurus.md": {
	id: "natasha-kurus.md";
  slug: "natasha-kurus";
  body: string;
  collection: "authors";
  data: any
} & { render(): Render[".md"] };
"nathan-white.md": {
	id: "nathan-white.md";
  slug: "nathan-white";
  body: string;
  collection: "authors";
  data: any
} & { render(): Render[".md"] };
"ryan-trimble.md": {
	id: "ryan-trimble.md";
  slug: "ryan-trimble";
  body: string;
  collection: "authors";
  data: any
} & { render(): Render[".md"] };
"scott-schwalm.md": {
	id: "scott-schwalm.md";
  slug: "scott-schwalm";
  body: string;
  collection: "authors";
  data: any
} & { render(): Render[".md"] };
"seth-kline.md": {
	id: "seth-kline.md";
  slug: "seth-kline";
  body: string;
  collection: "authors";
  data: any
} & { render(): Render[".md"] };
"steliana-vassileva.md": {
	id: "steliana-vassileva.md";
  slug: "steliana-vassileva";
  body: string;
  collection: "authors";
  data: any
} & { render(): Render[".md"] };
"ted-krueger.md": {
	id: "ted-krueger.md";
  slug: "ted-krueger";
  body: string;
  collection: "authors";
  data: any
} & { render(): Render[".md"] };
"thomas-sobieck.md": {
	id: "thomas-sobieck.md";
  slug: "thomas-sobieck";
  body: string;
  collection: "authors";
  data: any
} & { render(): Render[".md"] };
};
"posts": {
"2015-12-20-announcing-rimdev-releases.md": {
	id: "2015-12-20-announcing-rimdev-releases.md";
  slug: "announcing-rimdev-releases";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2016-01-12-copying-app-settings-and-connection-strings-between-azure-web-apps.md": {
	id: "2016-01-12-copying-app-settings-and-connection-strings-between-azure-web-apps.md";
  slug: "copying-app-settings-and-connection-strings-between-azure-web-apps";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2016-01-15-leveling-up-our-project-mangement.md": {
	id: "2016-01-15-leveling-up-our-project-mangement.md";
  slug: "leveling-up-our-project-management";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2016-01-16-windows-azure-identityserver3-and-valid-issuers.md": {
	id: "2016-01-16-windows-azure-identityserver3-and-valid-issuers.md";
  slug: "windows-azure-identityserver3-and-valid-issuers";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2016-01-19-openid-connect-and-asp-net-core-1-0.md": {
	id: "2016-01-19-openid-connect-and-asp-net-core-1-0.md";
  slug: "openid-connect-and-asp-net-core-1-0";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2016-01-22-add-and-update-github-tags-with-nodejs.md": {
	id: "2016-01-22-add-and-update-github-tags-with-nodejs.md";
  slug: "add-and-update-github-tags-with-nodejs";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2016-01-28-slack-hubot-and-webhooks-custom-notifications-using-all-three.md": {
	id: "2016-01-28-slack-hubot-and-webhooks-custom-notifications-using-all-three.md";
  slug: "slack-hubot-and-webhooks-custom-notifications-using-all-three";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2016-02-08-angular-prime-directive.md": {
	id: "2016-02-08-angular-prime-directive.md";
  slug: "angular-prime-directive";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2016-02-10-deploying-jekyll-to-windows-azure-app-services.md": {
	id: "2016-02-10-deploying-jekyll-to-windows-azure-app-services.md";
  slug: "deploying-jekyll-to-windows-azure-app-services";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2016-02-16-automating-stripe-exports-via-powershell.md": {
	id: "2016-02-16-automating-stripe-exports-via-powershell.md";
  slug: "automating-stripe-exports-via-powershell";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2016-02-25-jekyll-on-windows-a-quickstart-guide.md": {
	id: "2016-02-25-jekyll-on-windows-a-quickstart-guide.md";
  slug: "jekyll-on-windows-a-quickstart-guide";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2016-03-16-build-cmd-our-consistent-build-script-for-continuous-integration-using-teamcity.md": {
	id: "2016-03-16-build-cmd-our-consistent-build-script-for-continuous-integration-using-teamcity.md";
  slug: "build-cmd-our-consistent-build-script-for-continuous-integration-using-teamcity";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2016-03-22-building-a-better-blog.md": {
	id: "2016-03-22-building-a-better-blog.md";
  slug: "building-a-better-blog";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2016-03-22-extending-patch-support-for-asp.net-webapi-part-i.md": {
	id: "2016-03-22-extending-patch-support-for-asp.net-webapi-part-i.md";
  slug: "extending-patch-support-for-asp.net-webapi-part-i";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2016-03-24-extending-patch-support-for-asp.net-webapi-part-ii-model-binding.md": {
	id: "2016-03-24-extending-patch-support-for-asp.net-webapi-part-ii-model-binding.md";
  slug: "extending-patch-support-for-asp.net-webapi-part-ii-model-binding";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2016-03-30-using-stuntman-in-multi-application-scenarios.md": {
	id: "2016-03-30-using-stuntman-in-multi-application-scenarios.md";
  slug: "using-stuntman-in-multi-application-scenarios";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2016-03-31-extending-patch-support-for-asp.net-webapi-part-iii-fluentvalidation.md": {
	id: "2016-03-31-extending-patch-support-for-asp.net-webapi-part-iii-fluentvalidation.md";
  slug: "extending-patch-support-for-asp.net-webapi-part-iii-fluentvalidation";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2016-04-14-postman-effectively-storing-and-using-tests-in-a-git-repository.md": {
	id: "2016-04-14-postman-effectively-storing-and-using-tests-in-a-git-repository.md";
  slug: "2016-04-14-postman-effectively-storing-and-using-tests-in-a-git-repository";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2016-04-15-jekyll-and-iis-web-configuration-in-windows-azure.md": {
	id: "2016-04-15-jekyll-and-iis-web-configuration-in-windows-azure.md";
  slug: "jekyll-and-iis-web-configuration-in-windows-azure";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2016-04-29-namespace-changes-with-ef-migrations.md": {
	id: "2016-04-29-namespace-changes-with-ef-migrations.md";
  slug: "namespace-changes-with-ef-migrations";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2016-05-03-fixing-facebook-open-graph-404-post-previews.md": {
	id: "2016-05-03-fixing-facebook-open-graph-404-post-previews.md";
  slug: "fixing-facebook-open-graph-404-post-previews";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2016-06-02-the-story-of-our-openid-connect-implementation-live-at-ndc-oslo-2016.md": {
	id: "2016-06-02-the-story-of-our-openid-connect-implementation-live-at-ndc-oslo-2016.md";
  slug: "the-story-of-our-openid-connect-implementation-live-at-ndc-oslo-2016";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2016-06-15-rimdev-looking-for-team-member.md": {
	id: "2016-06-15-rimdev-looking-for-team-member.md";
  slug: "rimdev-looking-for-team-member";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2016-07-08-running-gulp-on-teamcity.md": {
	id: "2016-07-08-running-gulp-on-teamcity.md";
  slug: "running-gulp-on-teamcity";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2016-07-20-speech-recognition-configuration-provider-for-asp.net-core.md": {
	id: "2016-07-20-speech-recognition-configuration-provider-for-asp.net-core.md";
  slug: "speech-recognition-configuration-provider-for-asp.net-core";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2016-08-03-jekyll-article-sell-by-dates.md": {
	id: "2016-08-03-jekyll-article-sell-by-dates.md";
  slug: "jekyll-article-sell-by-dates";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2016-08-05-strongly-typed-configuration-settings-in-asp-net-core-part-ii.md": {
	id: "2016-08-05-strongly-typed-configuration-settings-in-asp-net-core-part-ii.md";
  slug: "strongly-typed-configuration-settings-in-asp-net-core-part-ii";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2016-08-09-fixing-slow-logins.md": {
	id: "2016-08-09-fixing-slow-logins.md";
  slug: "fixing-slow-logins";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2016-08-12-running-jekyll-on-kestrel-and-asp-net-core.md": {
	id: "2016-08-12-running-jekyll-on-kestrel-and-asp-net-core.md";
  slug: "running-jekyll-on-kestrel-and-asp-net-core";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2016-08-25-get-registered-routes-from-an-asp.net-mvc-core-application.md": {
	id: "2016-08-25-get-registered-routes-from-an-asp.net-mvc-core-application.md";
  slug: "get-registered-routes-from-an-asp.net-mvc-core-application";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2016-08-26-publishing-npm-packages-from-teamcity.md": {
	id: "2016-08-26-publishing-npm-packages-from-teamcity.md";
  slug: "publishing-npm-packages-from-teamcity";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2016-08-31-musings-of-a-madman-sharing-contracts-between-apis-and-clients.md": {
	id: "2016-08-31-musings-of-a-madman-sharing-contracts-between-apis-and-clients.md";
  slug: "musings-of-a-madman-sharing-contracts-between-apis-and-clients";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2016-09-02-rimdev-sweeps-the-asp.net-monsters-summerofconfig-contest.md": {
	id: "2016-09-02-rimdev-sweeps-the-asp.net-monsters-summerofconfig-contest.md";
  slug: "rimdev-sweeps-the-asp.net-monsters-summerofconfig-contest";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2016-09-16-under-the-decision-tree-1.md": {
	id: "2016-09-16-under-the-decision-tree-1.md";
  slug: "under-the-decision-tree-1";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2016-09-19-stuntmans-road-to-100-plus-github-stars.md": {
	id: "2016-09-19-stuntmans-road-to-100-plus-github-stars.md";
  slug: "stuntmans-road-to-100-plus-github-stars";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2016-09-21-middleware-madness-site-maintenance-in-aspnet-core.md": {
	id: "2016-09-21-middleware-madness-site-maintenance-in-aspnet-core.md";
  slug: "middleware-madness-site-maintenance-in-aspnet-core";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2016-09-23-under-the-decision-tree-2.md": {
	id: "2016-09-23-under-the-decision-tree-2.md";
  slug: "under-the-decision-tree-2";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2016-09-27-welcome-new-hire-getting-started-at-rimdev.md": {
	id: "2016-09-27-welcome-new-hire-getting-started-at-rimdev.md";
  slug: "welcome-new-hire-getting-started-at-rimdev";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2016-09-30-rimdev-io-going-open.md": {
	id: "2016-09-30-rimdev-io-going-open.md";
  slug: "rimdev-io-going-open";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2016-09-30-under-the-decision-tree-3.md": {
	id: "2016-09-30-under-the-decision-tree-3.md";
  slug: "under-the-decision-tree-3";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2016-10-07-under-the-decision-tree-4.md": {
	id: "2016-10-07-under-the-decision-tree-4.md";
  slug: "under-the-decision-tree-4";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2016-10-21-considering-hangfire-in-windows-azure-instead-of-webjobs.md": {
	id: "2016-10-21-considering-hangfire-in-windows-azure-instead-of-webjobs.md";
  slug: "considering-hangfire-in-windows-azure-instead-of-webjobs";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2016-10-26-building-net-core-on-travis-ci.md": {
	id: "2016-10-26-building-net-core-on-travis-ci.md";
  slug: "building-net-core-on-travis-ci";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2016-10-28-under-the-decision-tree-5.md": {
	id: "2016-10-28-under-the-decision-tree-5.md";
  slug: "under-the-decision-tree-5";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2016-11-01-using-css-filter-invert-for-low-vision-accessibility.md": {
	id: "2016-11-01-using-css-filter-invert-for-low-vision-accessibility.md";
  slug: "using-css-filter-invert-for-low-vision-accessibility";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2016-11-08-a-new-rimdev-on-semantic-ui.md": {
	id: "2016-11-08-a-new-rimdev-on-semantic-ui.md";
  slug: "a-new-rimdev-on-semantic-ui";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2016-11-10-adding-video-backgrounds-with-jekyll-front-matter.md": {
	id: "2016-11-10-adding-video-backgrounds-with-jekyll-front-matter.md";
  slug: "adding-video-backgrounds-with-jekyll-front-matter";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2016-11-11-converting-mp4-to-webm-using-ffmpeg-and-bash.md": {
	id: "2016-11-11-converting-mp4-to-webm-using-ffmpeg-and-bash.md";
  slug: "converting-mp4-to-webm-using-ffmpeg-and-bash";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2016-11-11-distinct-orderby-gotcha.md": {
	id: "2016-11-11-distinct-orderby-gotcha.md";
  slug: "distinct-orderby-gotcha";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2016-11-11-under-the-decision-tree-6.md": {
	id: "2016-11-11-under-the-decision-tree-6.md";
  slug: "under-the-decision-tree-6";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2016-11-18-under-the-decision-tree-7.md": {
	id: "2016-11-18-under-the-decision-tree-7.md";
  slug: "under-the-decision-tree-7";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2016-11-18-under-the-decision-tree-8.md": {
	id: "2016-11-18-under-the-decision-tree-8.md";
  slug: "under-the-decision-tree-8";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2016-11-18-under-the-decision-tree-9.md": {
	id: "2016-11-18-under-the-decision-tree-9.md";
  slug: "under-the-decision-tree-9";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2016-11-29-combining-age-and-date-of-birth-in-web-applications-using-age-picker.md": {
	id: "2016-11-29-combining-age-and-date-of-birth-in-web-applications-using-age-picker.md";
  slug: "combining-age-and-date-of-birth-in-web-applications-using-age-picker";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2016-11-30-leveraging-metadata-with-google-tag-manager.md": {
	id: "2016-11-30-leveraging-metadata-with-google-tag-manager.md";
  slug: "leveraging-metadata-with-google-tag-manager";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2016-12-07-let’s-drop-the-world-wide-web.md": {
	id: "2016-12-07-let’s-drop-the-world-wide-web.md";
  slug: "let’s-drop-the-world-wide-web";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2016-12-09-under-the-decision-tree-10.md": {
	id: "2016-12-09-under-the-decision-tree-10.md";
  slug: "under-the-decision-tree-10";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2016-12-16-under-the-decision-tree-11.md": {
	id: "2016-12-16-under-the-decision-tree-11.md";
  slug: "under-the-decision-tree-11";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2016-12-23-under-the-decision-tree-12.md": {
	id: "2016-12-23-under-the-decision-tree-12.md";
  slug: "under-the-decision-tree-12";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2016-12-30-a-year-of-open-source-2016.md": {
	id: "2016-12-30-a-year-of-open-source-2016.md";
  slug: "a-year-of-open-source-2016";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2016-12-30-under-the-decision-tree-13.md": {
	id: "2016-12-30-under-the-decision-tree-13.md";
  slug: "under-the-decision-tree-13";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2017-01-06-under-the-decision-tree-14.md": {
	id: "2017-01-06-under-the-decision-tree-14.md";
  slug: "under-the-decision-tree-14";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2017-01-11-bulk-import-documents-into-elasticsearch-using-nest.md": {
	id: "2017-01-11-bulk-import-documents-into-elasticsearch-using-nest.md";
  slug: "bulk-import-documents-into-elasticsearch-using-nest";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2017-01-11-design-dilemma-windows-azure-management-jekyll-and-deployments.md": {
	id: "2017-01-11-design-dilemma-windows-azure-management-jekyll-and-deployments.md";
  slug: "design-dilemma-windows-azure-management-jekyll-and-deployments";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2017-01-16-under-the-decision-tree-15.md": {
	id: "2017-01-16-under-the-decision-tree-15.md";
  slug: "under-the-decision-tree-15";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2017-01-17-the-mouse-is-not-my-friend.md": {
	id: "2017-01-17-the-mouse-is-not-my-friend.md";
  slug: "the-mouse-is-not-my-friend";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2017-01-18-the-rimdev-logo-story-or-a-tale-of-2-knights.md": {
	id: "2017-01-18-the-rimdev-logo-story-or-a-tale-of-2-knights.md";
  slug: "the-rimdev-logo-story-or-a-tale-of-2-knights";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2017-01-23-under-the-decision-tree-16.md": {
	id: "2017-01-23-under-the-decision-tree-16.md";
  slug: "under-the-decision-tree-16";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2017-02-08-creating-sql-server-express-localdb-v11-v12-and-v13-instances.md": {
	id: "2017-02-08-creating-sql-server-express-localdb-v11-v12-and-v13-instances.md";
  slug: "creating-sql-server-express-localdb-v11-v12-and-v13-instances";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2017-02-15-using-stuntman-with-aspnet-mvc-video.md": {
	id: "2017-02-15-using-stuntman-with-aspnet-mvc-video.md";
  slug: "using-stuntman-with-aspnet-mvc-video";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2017-02-17-get-current-route-name-from-aspnet-web-api-request.md": {
	id: "2017-02-17-get-current-route-name-from-aspnet-web-api-request.md";
  slug: "get-current-route-name-from-aspnet-web-api-request";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2017-02-23-the-component-life-creating-reusable-web-components.md": {
	id: "2017-02-23-the-component-life-creating-reusable-web-components.md";
  slug: "the-component-life-creating-reusable-web-components";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2017-02-28-publishing-to-npm-using-appveyor.md": {
	id: "2017-02-28-publishing-to-npm-using-appveyor.md";
  slug: "publishing-to-npm-using-appveyor";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2017-03-01-what-is-a-renaissance-and-what-does-it-have-to-do-with-dot-net.md": {
	id: "2017-03-01-what-is-a-renaissance-and-what-does-it-have-to-do-with-dot-net.md";
  slug: "what-is-a-renaissance-and-what-does-it-have-to-do-with-dot-net";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2017-03-03-adding-mermaid-to-rimdev-io.md": {
	id: "2017-03-03-adding-mermaid-to-rimdev-io.md";
  slug: "adding-mermaid-to-rimdev-io";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2017-04-10-a-double-click-experience-for-running-jekyll-on-windows.md": {
	id: "2017-04-10-a-double-click-experience-for-running-jekyll-on-windows.md";
  slug: "a-double-click-experience-for-running-jekyll-on-windows";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2017-05-07-secure-global-stuntman-users-with-windows-azure-blob-storage.md": {
	id: "2017-05-07-secure-global-stuntman-users-with-windows-azure-blob-storage.md";
  slug: "secure-global-stuntman-users-with-windows-azure-blob-storage";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2017-05-17-publishing-npm-packages-to-myget-using-appveyor.md": {
	id: "2017-05-17-publishing-npm-packages-to-myget-using-appveyor.md";
  slug: "publishing-npm-packages-to-myget-using-appveyor";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2017-05-31-khalid's-initial-thoughts-on-vuejs.md": {
	id: "2017-05-31-khalid's-initial-thoughts-on-vuejs.md";
  slug: "khalid's-initial-thoughts-on-vuejs";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2017-06-10-dot-net-fringe-portland-oregon-2017.md": {
	id: "2017-06-10-dot-net-fringe-portland-oregon-2017.md";
  slug: "dot-net-fringe-portland-oregon-2017";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2017-06-23-making-a-web-request-after-an-appveyor-deployment-to-start-an-application.md": {
	id: "2017-06-23-making-a-web-request-after-an-appveyor-deployment-to-start-an-application.md";
  slug: "making-a-web-request-after-an-appveyor-deployment-to-start-an-application";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2017-06-23-my-current-github-command-line-workflow.md": {
	id: "2017-06-23-my-current-github-command-line-workflow.md";
  slug: "my-current-github-command-line-workflow";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2017-06-29-avoid-the-duplicate-appveyor-publish-deploying-only-a-single-build.md": {
	id: "2017-06-29-avoid-the-duplicate-appveyor-publish-deploying-only-a-single-build.md";
  slug: "avoid-the-duplicate-appveyor-publish-deploying-only-a-single-build";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2017-08-01-material-design-like-form-animations-for-semantic-ui.md": {
	id: "2017-08-01-material-design-like-form-animations-for-semantic-ui.md";
  slug: "material-design-like-form-animations-for-semantic-ui";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2017-08-03-css-prefixes-yes-pleeease.md": {
	id: "2017-08-03-css-prefixes-yes-pleeease.md";
  slug: "css-prefixes-yes-pleeease";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2017-08-09-why-we-use-nullables-on-our-aspnet-web-api-2-requests.md": {
	id: "2017-08-09-why-we-use-nullables-on-our-aspnet-web-api-2-requests.md";
  slug: "why-we-use-nullables-on-our-aspnet-web-api-2-requests";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2017-08-16-dbdatareader-sql-server-data-chunking.md": {
	id: "2017-08-16-dbdatareader-sql-server-data-chunking.md";
  slug: "dbdatareader-sql-server-data-chunking";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2017-09-07-why-does-window-exports-unexpectedly-exist.md": {
	id: "2017-09-07-why-does-window-exports-unexpectedly-exist.md";
  slug: "why-does-window-exports-unexpectedly-exist";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2017-09-29-rimdev-hacktoberfest-2017.md": {
	id: "2017-09-29-rimdev-hacktoberfest-2017.md";
  slug: "rimdev-hacktoberfest-2017";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2017-09-29-spinning-up-a-local-server-with-gulp.md": {
	id: "2017-09-29-spinning-up-a-local-server-with-gulp.md";
  slug: "spinning-up-a-local-server-with-gulp";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2017-10-02-optimizing-linq-sql-skip-take.md": {
	id: "2017-10-02-optimizing-linq-sql-skip-take.md";
  slug: "optimizing-linq-sql-skip-take";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2017-10-06-back-to-basics-html-forms.md": {
	id: "2017-10-06-back-to-basics-html-forms.md";
  slug: "back-to-basics-html-forms";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2017-10-06-how-child-components-can-respond-to-store-actions.md": {
	id: "2017-10-06-how-child-components-can-respond-to-store-actions.md";
  slug: "how-child-components-can-respond-to-store-actions";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2017-11-29-dotnet-full-framework-build-test-and-deploy-using-cake-and-appveyor.md": {
	id: "2017-11-29-dotnet-full-framework-build-test-and-deploy-using-cake-and-appveyor.md";
  slug: "dotnet-full-framework-build-test-and-deploy-using-cake-and-appveyor";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2017-12-02-elasticsearch-sinking-in-deep-paging-quicksand.md": {
	id: "2017-12-02-elasticsearch-sinking-in-deep-paging-quicksand.md";
  slug: "elasticsearch-sinking-in-deep-paging-quicksand";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2018-02-01-vue.js-import-paths.md": {
	id: "2018-02-01-vue.js-import-paths.md";
  slug: "vue.js-import-paths";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2018-02-08-announcing-organizational-backing-for-identityserver.md": {
	id: "2018-02-08-announcing-organizational-backing-for-identityserver.md";
  slug: "announcing-organizational-backing-for-identityserver";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2018-02-12-communicating-between-components-in-separate-scopes.md": {
	id: "2018-02-12-communicating-between-components-in-separate-scopes.md";
  slug: "communicating-between-components-in-separate-scopes";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2018-02-13-the-pros-and-cons-of-state-management.md": {
	id: "2018-02-13-the-pros-and-cons-of-state-management.md";
  slug: "the-pros-and-cons-of-state-management";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2018-03-20-stuntman-2.0-unifies-packages-and-supports-asp-net-core-2.0.md": {
	id: "2018-03-20-stuntman-2.0-unifies-packages-and-supports-asp-net-core-2.0.md";
  slug: "stuntman-2.0-unifies-packages-and-supports-asp-net-core-2.0";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2018-04-13-ef-reality-improper-db-setup.md": {
	id: "2018-04-13-ef-reality-improper-db-setup.md";
  slug: "ef-reality-improper-db-setup";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2018-04-18-find-numbers-in-a-c-sharp-string.md": {
	id: "2018-04-18-find-numbers-in-a-c-sharp-string.md";
  slug: "find-numbers-in-a-c-sharp-string";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2018-05-04-handling-user-defined-sql-exceptions-in-c-sharp-7.md": {
	id: "2018-05-04-handling-user-defined-sql-exceptions-in-c-sharp-7.md";
  slug: "handling-user-defined-sql-exceptions-in-c-sharp-7";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2018-05-18-understanding-user-access-within-your-ecosystem.md": {
	id: "2018-05-18-understanding-user-access-within-your-ecosystem.md";
  slug: "understanding-user-access-within-your-ecosystem";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2018-06-04-the-teams-thoughts-on-the-microsoft-github-acquisition.md": {
	id: "2018-06-04-the-teams-thoughts-on-the-microsoft-github-acquisition.md";
  slug: "the-teams-thoughts-on-the-microsoft-github-acquisition";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2018-06-05-random-vue-tips.md": {
	id: "2018-06-05-random-vue-tips.md";
  slug: "random-vue-tips";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2018-06-08-ie-still-breaking-promises-literally.md": {
	id: "2018-06-08-ie-still-breaking-promises-literally.md";
  slug: "ie-still-breaking-promises-literally";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2018-07-28-building-site-using-latest-hugo-on-appveyor.md": {
	id: "2018-07-28-building-site-using-latest-hugo-on-appveyor.md";
  slug: "building-site-using-latest-hugo-on-appveyor";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2018-08-01-hugo-extended-latest-install-script-for-macos.md": {
	id: "2018-08-01-hugo-extended-latest-install-script-for-macos.md";
  slug: "hugo-extended-latest-install-script-for-macos";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2018-08-24-does-a-property-exist-on-my-c-sharp-object.md": {
	id: "2018-08-24-does-a-property-exist-on-my-c-sharp-object.md";
  slug: "does-a-property-exist-on-my-c-sharp-object";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2018-08-30-querying-json-recursively-in-azure-sql-database.md": {
	id: "2018-08-30-querying-json-recursively-in-azure-sql-database.md";
  slug: "querying-json-recursively-in-azure-sql-database";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2018-09-12-debugging-hugo-site-data.md": {
	id: "2018-09-12-debugging-hugo-site-data.md";
  slug: "debugging-hugo-site-data";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2018-09-12-using-dotnet-core-tuple-deconstruction-and-npoco-for-performant-sql-access.md": {
	id: "2018-09-12-using-dotnet-core-tuple-deconstruction-and-npoco-for-performant-sql-access.md";
  slug: "using-dotnet-core-tuple-deconstruction-and-npoco-for-performant-sql-access";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2018-09-16-how-to-check-for-nulls-in-c-sharp.md": {
	id: "2018-09-16-how-to-check-for-nulls-in-c-sharp.md";
  slug: "how-to-check-for-nulls-in-c-sharp";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2018-10-03-working-with-nested-aggregates-using-nest-and-elasticsearch.md": {
	id: "2018-10-03-working-with-nested-aggregates-using-nest-and-elasticsearch.md";
  slug: "working-with-nested-aggregates-using-nest-and-elasticsearch";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2018-10-07-c-sharp-inheritance-errors-you-could-miss.md": {
	id: "2018-10-07-c-sharp-inheritance-errors-you-could-miss.md";
  slug: "c-sharp-inheritance-errors-you-could-miss";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2018-10-08-post-javascript-object-cloning.md": {
	id: "2018-10-08-post-javascript-object-cloning.md";
  slug: "post-javascript-object-cloning";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2018-10-12-using-sass-maps-to-extend-bootstrap.md": {
	id: "2018-10-12-using-sass-maps-to-extend-bootstrap.md";
  slug: "using-sass-maps-to-extend-bootstrap";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2018-10-17-using-environment-variables-with-jekyll-vue.md": {
	id: "2018-10-17-using-environment-variables-with-jekyll-vue.md";
  slug: "using-environment-variables-with-jekyll-vue";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2018-10-18-no-compression-leads-to-bad-impression.md": {
	id: "2018-10-18-no-compression-leads-to-bad-impression.md";
  slug: "no-compression-leads-to-bad-impression";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2018-10-22-the-v-for-key.md": {
	id: "2018-10-22-the-v-for-key.md";
  slug: "the-v-for-key";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2018-10-26-global-versus-component-state.md": {
	id: "2018-10-26-global-versus-component-state.md";
  slug: "global-versus-component-state";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2018-11-20-export-csv-table-of-all-azure-web-apps-configuration-in-subscription.md": {
	id: "2018-11-20-export-csv-table-of-all-azure-web-apps-configuration-in-subscription.md";
  slug: "export-csv-table-of-all-azure-web-apps-configuration-in-subscription";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2018-12-03-how-to-make-golden-egg-fried-rice.md": {
	id: "2018-12-03-how-to-make-golden-egg-fried-rice.md";
  slug: "how-to-make-golden-egg-fried-rice";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2018-12-12-ritter-insurance-marketing-is-sponsoring-vueconf-2019.md": {
	id: "2018-12-12-ritter-insurance-marketing-is-sponsoring-vueconf-2019.md";
  slug: "ritter-insurance-marketing-is-sponsoring-vueconf-2019";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2018-12-26-performance-tests-benchmarks-for-aspnetcore-2.2-endpoints.md": {
	id: "2018-12-26-performance-tests-benchmarks-for-aspnetcore-2.2-endpoints.md";
  slug: "performance-tests-benchmarks-for-aspnetcore-2.2-endpoints";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2019-01-04-beware-sqlbulkcopy-case-sensitivity.md": {
	id: "2019-01-04-beware-sqlbulkcopy-case-sensitivity.md";
  slug: "beware-sqlbulkcopy-case-sensitivity";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2019-01-10-running-an-appveyor-build-after-creating-an-azure-web-app-using-terraform.md": {
	id: "2019-01-10-running-an-appveyor-build-after-creating-an-azure-web-app-using-terraform.md";
  slug: "running-an-appveyor-build-after-creating-an-azure-web-app-using-terraform";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2019-01-21-aspnet-core-razor-pages-and-http-status-control-flow.md": {
	id: "2019-01-21-aspnet-core-razor-pages-and-http-status-control-flow.md";
  slug: "aspnet-core-razor-pages-and-http-status-control-flow";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2019-01-21-computed-side-effects.md": {
	id: "2019-01-21-computed-side-effects.md";
  slug: "computed-side-effects";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2019-01-21-successfully-deploying-an-inprocess-aspnetcore-2-2-app-to-azure.md": {
	id: "2019-01-21-successfully-deploying-an-inprocess-aspnetcore-2-2-app-to-azure.md";
  slug: "successfully-deploying-an-inprocess-aspnetcore-2-2-app-to-azure";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2019-01-25-vue-cli-environment-variables.md": {
	id: "2019-01-25-vue-cli-environment-variables.md";
  slug: "vue-cli-environment-variables";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2019-02-11-robustly-upgrading-target-dotnet-framework-version.md": {
	id: "2019-02-11-robustly-upgrading-target-dotnet-framework-version.md";
  slug: "robustly-upgrading-target-dotnet-framework-version";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2019-02-11-wsl-git-asp-net-mvc.md": {
	id: "2019-02-11-wsl-git-asp-net-mvc.md";
  slug: "wsl-git-asp-net-mvc";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2019-02-12-using-aspnet-core-health-checks-with-aspnet-full-framework.md": {
	id: "2019-02-12-using-aspnet-core-health-checks-with-aspnet-full-framework.md";
  slug: "using-aspnet-core-health-checks-with-aspnet-full-framework";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2019-02-21-asp-net-core-routes-middleware.md": {
	id: "2019-02-21-asp-net-core-routes-middleware.md";
  slug: "asp-net-core-routes-middleware";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2019-02-25-setting-azure-web-app-slot-auto-swap-using-arm-templates-and-terraform.md": {
	id: "2019-02-25-setting-azure-web-app-slot-auto-swap-using-arm-templates-and-terraform.md";
  slug: "setting-azure-web-app-slot-auto-swap-using-arm-templates-and-terraform";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2019-02-28-getting-started-with-webpack.md": {
	id: "2019-02-28-getting-started-with-webpack.md";
  slug: "getting-started-with-webpack";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2019-03-05-vue-simple-group-transitions.md": {
	id: "2019-03-05-vue-simple-group-transitions.md";
  slug: "vue-simple-group-transitions";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2019-03-06-letting-sass-build-your-utility-classes.md": {
	id: "2019-03-06-letting-sass-build-your-utility-classes.md";
  slug: "letting-sass-build-your-utility-classes";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2019-03-06-welcome-new-hire-getting-started-in-frontend-at-rimdev.md": {
	id: "2019-03-06-welcome-new-hire-getting-started-in-frontend-at-rimdev.md";
  slug: "welcome-new-hire-getting-started-in-frontend-at-rimdev";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2019-03-07-making-dotnet-global-tools-work-with-ohmyzsh.md": {
	id: "2019-03-07-making-dotnet-global-tools-work-with-ohmyzsh.md";
  slug: "making-dotnet-global-tools-work-with-ohmyzsh";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2019-03-14-orchestrating-web-server-integration-tests-using-npm.md": {
	id: "2019-03-14-orchestrating-web-server-integration-tests-using-npm.md";
  slug: "orchestrating-web-server-integration-tests-using-npm";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2019-04-01-multi-instance-aspnetcore-2.2-data-protection-using-redis-and-an-azure-key-vault-certificate.md": {
	id: "2019-04-01-multi-instance-aspnetcore-2.2-data-protection-using-redis-and-an-azure-key-vault-certificate.md";
  slug: "multi-instance-aspnetcore-2.2-data-protection-using-redis-and-an-azure-key-vault-certificate";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2019-04-02-find-auto-generated-aspnet-machine-key-in-azure-web-apps.md": {
	id: "2019-04-02-find-auto-generated-aspnet-machine-key-in-azure-web-apps.md";
  slug: "find-auto-generated-aspnet-machine-key-in-azure-web-apps";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2019-04-03-strongly-typed-feature-flags-with-aspnetcore-2.2.md": {
	id: "2019-04-03-strongly-typed-feature-flags-with-aspnetcore-2.2.md";
  slug: "strongly-typed-feature-flags-with-aspnetcore-2.2";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2019-05-17-making-media-query-mixins-with-sass.md": {
	id: "2019-05-17-making-media-query-mixins-with-sass.md";
  slug: "making-media-query-mixins-with-sass";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2019-05-29-augmenting-principal-identityserver-net-core.md": {
	id: "2019-05-29-augmenting-principal-identityserver-net-core.md";
  slug: "augmenting-principal-identityserver-net-core";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2019-06-01-an-interesting-case-of-dotnet-performance-and-caching.md": {
	id: "2019-06-01-an-interesting-case-of-dotnet-performance-and-caching.md";
  slug: "an-interesting-case-of-dotnet-performance-and-caching";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2019-06-17-hugo-error-pages-with-iis-in-windows-azure.md": {
	id: "2019-06-17-hugo-error-pages-with-iis-in-windows-azure.md";
  slug: "hugo-error-pages-with-iis-in-windows-azure";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2019-07-03-polyfills-to-support-ie-11-and-non-es6-browsers.md": {
	id: "2019-07-03-polyfills-to-support-ie-11-and-non-es6-browsers.md";
  slug: "polyfills-to-support-ie-11-and-non-es6-browsers";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2019-07-08-solving-dotnet-core-https-development-certificate-issues-on-macos.md": {
	id: "2019-07-08-solving-dotnet-core-https-development-certificate-issues-on-macos.md";
  slug: "solving-dotnet-core-https-development-certificate-issues-on-macos";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2019-07-12-deprecating-subdomains-effectively-with-windows-azure-and-iis.md": {
	id: "2019-07-12-deprecating-subdomains-effectively-with-windows-azure-and-iis.md";
  slug: "deprecating-subdomains-effectively-with-windows-azure-and-iis";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2019-07-26-iis-rewrite-maps-and-redirecting-on-url-paths.md": {
	id: "2019-07-26-iis-rewrite-maps-and-redirecting-on-url-paths.md";
  slug: "iis-rewrite-maps-and-redirecting-on-url-paths";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2019-07-31-filter-hangfire-requests-from-microsoft-azure-application-insights.md": {
	id: "2019-07-31-filter-hangfire-requests-from-microsoft-azure-application-insights.md";
  slug: "filter-hangfire-requests-from-microsoft-azure-application-insights";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2019-08-02-fixing-aspnet-core-usestatuscodepages-middleware.md": {
	id: "2019-08-02-fixing-aspnet-core-usestatuscodepages-middleware.md";
  slug: "fixing-aspnet-core-usestatuscodepages-middleware";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2019-08-09-redact-elasticsearch-passwords-from-microsoft-azure-application-insights-using-csharp.md": {
	id: "2019-08-09-redact-elasticsearch-passwords-from-microsoft-azure-application-insights-using-csharp.md";
  slug: "redact-elasticsearch-passwords-from-microsoft-azure-application-insights-using-csharp";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2019-08-21-avoiding-aspnet-core-configuration-pitfalls-with-array-values.md": {
	id: "2019-08-21-avoiding-aspnet-core-configuration-pitfalls-with-array-values.md";
  slug: "avoiding-aspnet-core-configuration-pitfalls-with-array-values";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2019-08-26-retry-transient-failures-using-sqlclient-adonet-with-polly.md": {
	id: "2019-08-26-retry-transient-failures-using-sqlclient-adonet-with-polly.md";
  slug: "retry-transient-failures-using-sqlclient-adonet-with-polly";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2019-08-28-our-devops-journey-release-branches-highly-available-azure-web-apps-and-terraform.md": {
	id: "2019-08-28-our-devops-journey-release-branches-highly-available-azure-web-apps-and-terraform.md";
  slug: "our-devops-journey-release-branches-highly-available-azure-web-apps-and-terraform";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2019-08-29-working-at-work-this-and-other-thoughts-on-high-availability.md": {
	id: "2019-08-29-working-at-work-this-and-other-thoughts-on-high-availability.md";
  slug: "working-at-work-this-and-other-thouhgts-on-high-availability";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2019-08-30-chatops-at-rimdev.md": {
	id: "2019-08-30-chatops-at-rimdev.md";
  slug: "chatops-at-rimdev";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2019-08-30-takeaways-from-an-event-apart.md": {
	id: "2019-08-30-takeaways-from-an-event-apart.md";
  slug: "takeaways-from-an-event-apart";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2019-09-06-ux-ui-solutions-make-content-less-overwhelming.md": {
	id: "2019-09-06-ux-ui-solutions-make-content-less-overwhelming.md";
  slug: "ux-ui-solutions-make-content-less-overwhelming";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2019-09-09-caching-git-lfs-in-appveyor-to-avoid-large-github-lfs-bills.md": {
	id: "2019-09-09-caching-git-lfs-in-appveyor-to-avoid-large-github-lfs-bills.md";
  slug: "caching-git-lfs-in-appveyor-to-avoid-large-github-lfs-bills";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2019-10-01-npm-packages-and-tgz-files.md": {
	id: "2019-10-01-npm-packages-and-tgz-files.md";
  slug: "npm-packages-and-tgz-files";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2019-10-07-artifact-conference-reflection.md": {
	id: "2019-10-07-artifact-conference-reflection.md";
  slug: "artifact-conference-reflection";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2019-10-09-avoiding-linq-firstordefault-mishap.md": {
	id: "2019-10-09-avoiding-linq-firstordefault-mishap.md";
  slug: "avoiding-linq-firstordefault-mishap";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2019-10-11-static-property-ordering-is-important.md": {
	id: "2019-10-11-static-property-ordering-is-important.md";
  slug: "static-property-ordering-is-important";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2019-10-15-a-case-of-newtonsoft-json-typenamehandling-all-and-jsonserializationexception.md": {
	id: "2019-10-15-a-case-of-newtonsoft-json-typenamehandling-all-and-jsonserializationexception.md";
  slug: "a-case-of-newtonsoft-json-typenamehandling-all-and-jsonserializationexception";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2019-10-16-upcoming-google-chrome-samesite-change-breaks-our-identityserver3-azure-active-directory-login-and-how-to-fix-it.md": {
	id: "2019-10-16-upcoming-google-chrome-samesite-change-breaks-our-identityserver3-azure-active-directory-login-and-how-to-fix-it.md";
  slug: "upcoming-google-chrome-samesite-change-breaks-our-identityserver3-azure-active-directory-login-and-how-to-fix-it";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2019-10-18-vue-3-composition-api.md": {
	id: "2019-10-18-vue-3-composition-api.md";
  slug: "vue-3-composition-api";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2019-10-21-non-pro-premier-sendgrid-accounts-may-have-issues-sending-to-popular-microsoft-domains-outlook-com-etc.md": {
	id: "2019-10-21-non-pro-premier-sendgrid-accounts-may-have-issues-sending-to-popular-microsoft-domains-outlook-com-etc.md";
  slug: "non-pro-premier-sendgrid-accounts-may-have-issues-sending-to-popular-microsoft-domains-outlook-com-etc";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2019-10-24-writing-a-compatible-date-input.md": {
	id: "2019-10-24-writing-a-compatible-date-input.md";
  slug: "writing-a-compatible-date-input";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2019-10-31-autofac-eager-vs-lazy-construction-during-registration.md": {
	id: "2019-10-31-autofac-eager-vs-lazy-construction-during-registration.md";
  slug: "autofac-eager-vs-lazy-construction-during-registration";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2019-11-01-understanding-dart-sass-modules-and-name-spaced-variables.md": {
	id: "2019-11-01-understanding-dart-sass-modules-and-name-spaced-variables.md";
  slug: "understanding-dart-sass-modules-and-name-spaced-variables";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2019-11-04-foreach-for-ie-11.md": {
	id: "2019-11-04-foreach-for-ie-11.md";
  slug: "foreach-for-ie-11";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2019-11-04-logging-aspnet-webapi2-failed-request-body-to-application-insights.md": {
	id: "2019-11-04-logging-aspnet-webapi2-failed-request-body-to-application-insights.md";
  slug: "logging-aspnet-webapi2-failed-request-body-to-application-insights";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2019-11-25-z-index-is-confusing.md": {
	id: "2019-11-25-z-index-is-confusing.md";
  slug: "z-index-is-confusing";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2019-12-10-regex-performance-with-and-without-regexoptions-compiled-using-dotnet-framework-48-and-net-core-31-december-2019.md": {
	id: "2019-12-10-regex-performance-with-and-without-regexoptions-compiled-using-dotnet-framework-48-and-net-core-31-december-2019.md";
  slug: "regex-performance-with-and-without-regexoptions-compiled-using-dotnet-framework-48-and-net-core-31-december-2019";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2020-01-03-what-works-and-what-doesnt-with-configurationmanager-appsettings-using-aspnetcore31.md": {
	id: "2020-01-03-what-works-and-what-doesnt-with-configurationmanager-appsettings-using-aspnetcore31.md";
  slug: "what-works-and-what-doesnt-with-configurationmanager-appsettings-using-aspnetcore31";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2020-01-22-building-aspnetcore-31-apps-to-organizational-standards-using-extension-methods.md": {
	id: "2020-01-22-building-aspnetcore-31-apps-to-organizational-standards-using-extension-methods.md";
  slug: "building-aspnetcore-31-apps-to-organizational-standards-using-extension-methods";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2020-02-26-running-database-migrations-on-web-application-startup-whats-ok-and-whats-risky.md": {
	id: "2020-02-26-running-database-migrations-on-web-application-startup-whats-ok-and-whats-risky.md";
  slug: "running-database-migrations-on-web-application-startup-whats-ok-and-whats-risky";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2020-03-09-getting-started-testing-vue-components.md": {
	id: "2020-03-09-getting-started-testing-vue-components.md";
  slug: "getting-started-testing-vue-components";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2020-03-09-how-conveyux-can-convey-good-ideas.md": {
	id: "2020-03-09-how-conveyux-can-convey-good-ideas.md";
  slug: "how-conveyux-can-convey-good-ideas";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2020-03-11-how-to-avoid-null-reference-exception.md": {
	id: "2020-03-11-how-to-avoid-null-reference-exception.md";
  slug: "how-to-avoid-null-reference-exception";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2020-04-20-elasticsearch-with-nest-using-csharp-nameof-not-working.md": {
	id: "2020-04-20-elasticsearch-with-nest-using-csharp-nameof-not-working.md";
  slug: "elasticsearch-with-nest-using-csharp-nameof-not-working";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2020-04-23-css-only-tooltip-for-all-screen-sizes.md": {
	id: "2020-04-23-css-only-tooltip-for-all-screen-sizes.md";
  slug: "css-only-tooltip-for-all-screen-sizes";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2020-06-04-default-system-text-json-settings-dont-roundtrip-serialize-deserialize-through-test-server.md": {
	id: "2020-06-04-default-system-text-json-settings-dont-roundtrip-serialize-deserialize-through-test-server.md";
  slug: "default-system-text-json-settings-dont-roundtrip-serialize-deserialize-through-test-server";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2020-06-05-newtonsoft-json-issues-with-enumerable-empty-t-assignment.md": {
	id: "2020-06-05-newtonsoft-json-issues-with-enumerable-empty-t-assignment.md";
  slug: "newtonsoft-json-issues-with-enumerable-empty-t-assignment";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2020-06-18-swagger-grouping-with-controller-name-fallback-using-swashbuckle-aspnetcore.md": {
	id: "2020-06-18-swagger-grouping-with-controller-name-fallback-using-swashbuckle-aspnetcore.md";
  slug: "swagger-grouping-with-controller-name-fallback-using-swashbuckle-aspnetcore";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2020-06-29-customizing-components-with-scoped-slots.md": {
	id: "2020-06-29-customizing-components-with-scoped-slots.md";
  slug: "customizing-components-with-scoped-slots";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2020-07-09-defaulting-aspnet-core-31-to-require-authentication-for-a-safer-developer-experience.md": {
	id: "2020-07-09-defaulting-aspnet-core-31-to-require-authentication-for-a-safer-developer-experience.md";
  slug: "defaulting-aspnet-core-31-to-require-authentication-for-a-safer-developer-experience";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2020-09-22-vue-3-is-official.md": {
	id: "2020-09-22-vue-3-is-official.md";
  slug: "vue-3-is-official";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2020-10-10-platform-ui-background-image-and-gradient-utilities.md": {
	id: "2020-10-10-platform-ui-background-image-and-gradient-utilities.md";
  slug: "platform-ui-background-image-and-gradient-utilities";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2020-10-26-tab-colors-in-azure-data-studio.md": {
	id: "2020-10-26-tab-colors-in-azure-data-studio.md";
  slug: "tab-colors-in-azure-data-studio";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2020-12-02-welcome-new-hire-getting-started-in-frontend-at-rimdev-updated.md": {
	id: "2020-12-02-welcome-new-hire-getting-started-in-frontend-at-rimdev-updated.md";
  slug: "welcome-new-hire-getting-started-in-frontend-at-rimdev-updated";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2020-12-11-css-only-dropdown-menu.md": {
	id: "2020-12-11-css-only-dropdown-menu.md";
  slug: "css-only-dropdown-menu";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2021-02-19-hugo-archetypes-to-the-rescue.md": {
	id: "2021-02-19-hugo-archetypes-to-the-rescue.md";
  slug: "hugo-archetypes-to-the-rescue";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2021-03-17-prettifying-long-commit-histories.md": {
	id: "2021-03-17-prettifying-long-commit-histories.md";
  slug: "prettifying-long-commit-histories";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2021-10-11-get-branching-with-git.md": {
	id: "2021-10-11-get-branching-with-git.md";
  slug: "get-branching-with-git";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2021-11-24-custom-properties.md": {
	id: "2021-11-24-custom-properties.md";
  slug: "custom-properties";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2021-12-17-creating-rss-feeds-using-hugo.md": {
	id: "2021-12-17-creating-rss-feeds-using-hugo.md";
  slug: "creating-rss-feeds-using-hugo";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2022-01-18-ux-writing-lessons-for-technical-writers.md": {
	id: "2022-01-18-ux-writing-lessons-for-technical-writers.md";
  slug: "ux-writing-lessons-for-technical-writers";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2022-03-21-getting-to-work-on-your-new-apple-silicon-macbook-pro.md": {
	id: "2022-03-21-getting-to-work-on-your-new-apple-silicon-macbook-pro.md";
  slug: "getting-to-work-on-your-new-apple-silicon-macbook-pro";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2022-04-29-targeting-devices-for-hover-effects.md": {
	id: "2022-04-29-targeting-devices-for-hover-effects.md";
  slug: "targeting-devices-for-hover-effects";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2022-05-18-animated-scroll-effects.md": {
	id: "2022-05-18-animated-scroll-effects.md";
  slug: "animated-scroll-effects";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2022-06-10-welcome-to-platform-ui-our-css-framework.md": {
	id: "2022-06-10-welcome-to-platform-ui-our-css-framework.md";
  slug: "welcome-to-platform-ui-our-css-framework";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2022-06-16-building-an-online-store-with-platform-ui-and-hugo.md": {
	id: "2022-06-16-building-an-online-store-with-platform-ui-and-hugo.md";
  slug: "building-an-online-store-with-platform-ui-and-hugo";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2022-07-06-vertical-alignment-bug-with-icons.md": {
	id: "2022-07-06-vertical-alignment-bug-with-icons.md";
  slug: "vertical-alignment-bug-with-icons";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2022-07-28-finally-understanding-the-promise-chain.md": {
	id: "2022-07-28-finally-understanding-the-promise-chain.md";
  slug: "finally-understanding-the-promise-chain";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2022-08-11-recreating-the-spotify-like-button.md": {
	id: "2022-08-11-recreating-the-spotify-like-button.md";
  slug: "recreating-the-spotify-like-button";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2022-10-12-rimdev-radio-building-with-astro.md": {
	id: "2022-10-12-rimdev-radio-building-with-astro.md";
  slug: "rimdev-radio-building-with-astro";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2022-11-29-vue-3-custom-elements.md": {
	id: "2022-11-29-vue-3-custom-elements.md";
  slug: "vue-3-custom-elements";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2023-02-27-generating-your-own-fonts-with-fantasticon.md": {
	id: "2023-02-27-generating-your-own-fonts-with-fantasticon.md";
  slug: "generating-your-own-fonts-with-fantasticon";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2023-03-09-creating-a-pagination-component-with-astro.md": {
	id: "2023-03-09-creating-a-pagination-component-with-astro.md";
  slug: "creating-a-pagination-component-with-astro";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2023-03-27-leveling-up-your-project-testing-with-tsqlt-unit-tests-for-sql-queries.md": {
	id: "2023-03-27-leveling-up-your-project-testing-with-tsqlt-unit-tests-for-sql-queries.md";
  slug: "leveling-up-your-project-testing-with-tSQLt-unit-tests-for-sql-queries";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2023-04-11-never-get-bit-by-z-index-again.md": {
	id: "2023-04-11-never-get-bit-by-z-index-again.md";
  slug: "never-get-bit-by-z-index-again";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2023-07-12-astro-redirects.md": {
	id: "2023-07-12-astro-redirects.md";
  slug: "creating-a-redirect-in-astro";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2023-07-21-negative-calc-values.md": {
	id: "2023-07-21-negative-calc-values.md";
  slug: "setting-a-negative-value-with-custom-properties";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2023-10-24-git-workflow.md": {
	id: "2023-10-24-git-workflow.md";
  slug: "git-workflow";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2023-11-17-auto-importing-components-in-astro-mdx.md": {
	id: "2023-11-17-auto-importing-components-in-astro-mdx.md";
  slug: "automatically-import-components-in-astro-mdx";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2024-04-10-csharp-uri-concatenation.md": {
	id: "2024-04-10-csharp-uri-concatenation.md";
  slug: "csharp-uri-concatenation";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
"2024-04-16-archive-nuget-packages-from-gitub.md": {
	id: "2024-04-16-archive-nuget-packages-from-gitub.md";
  slug: "archive-nuget-packages-from-github";
  body: string;
  collection: "posts";
  data: any
} & { render(): Render[".md"] };
};
"redirects": {
"gotopets.md": {
	id: "gotopets.md";
  slug: "show-me-cute-animals";
  body: string;
  collection: "redirects";
  data: any
} & { render(): Render[".md"] };
};

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	type ContentConfig = never;
}
