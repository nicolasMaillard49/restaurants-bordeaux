--
-- PostgreSQL database dump
--

\restrict SFn94AzGNgU75XFLUK6DLJUcBHE4XfqVg2hjd3MPDRCbi54Kzt36l8X1zMw9jQu

-- Dumped from database version 15.15
-- Dumped by pg_dump version 15.15

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: restaurants; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.restaurants (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    google_place_id character varying(255),
    name character varying(255) NOT NULL,
    description text NOT NULL,
    rating numeric(3,2),
    rating_count integer,
    address character varying(500) NOT NULL,
    city character varying(100) DEFAULT 'Bordeaux'::character varying NOT NULL,
    website character varying(500),
    phone character varying(50),
    opening_hours jsonb,
    price_level integer,
    google_maps_url character varying(500),
    types jsonb,
    cuisine_origin character varying(200),
    reviews jsonb,
    images jsonb,
    source character varying(100) DEFAULT 'google_maps'::character varying NOT NULL,
    last_update timestamp without time zone DEFAULT now() NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.restaurants OWNER TO admin;

--
-- Data for Name: restaurants; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.restaurants (id, google_place_id, name, description, rating, rating_count, address, city, website, phone, opening_hours, price_level, google_maps_url, types, cuisine_origin, reviews, images, source, last_update, created_at, updated_at) FROM stdin;
\.


--
-- Name: restaurants PK_e2133a72eb1cc8f588f7b503e68; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.restaurants
    ADD CONSTRAINT "PK_e2133a72eb1cc8f588f7b503e68" PRIMARY KEY (id);


--
-- Name: restaurants UQ_a674395516b5d677d80aa8e4f30; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.restaurants
    ADD CONSTRAINT "UQ_a674395516b5d677d80aa8e4f30" UNIQUE (google_place_id);


--
-- Name: IDX_4550dab129b82f7ae4e6a87739; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX "IDX_4550dab129b82f7ae4e6a87739" ON public.restaurants USING btree (name, address);


--
-- PostgreSQL database dump complete
--

\unrestrict SFn94AzGNgU75XFLUK6DLJUcBHE4XfqVg2hjd3MPDRCbi54Kzt36l8X1zMw9jQu

