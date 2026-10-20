CREATE TABLE "articles" (
	"id" serial PRIMARY KEY,
	"title" text NOT NULL,
	"slug" text NOT NULL UNIQUE,
	"excerpt" text NOT NULL,
	"content" text NOT NULL,
	"category" text NOT NULL,
	"image_key" text,
	"author" text DEFAULT 'Rédaction LEGEND' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
