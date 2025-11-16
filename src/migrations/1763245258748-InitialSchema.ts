import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1763245258748 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Crear tipos ENUM solo si no existen
        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'client_gender_enum') THEN
                    CREATE TYPE public.client_gender_enum AS ENUM (
                        'male',
                        'female'
                    );
                END IF;
            END$$;
        `);

        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'client_preferred_contact_method_enum') THEN
                    CREATE TYPE public.client_preferred_contact_method_enum AS ENUM (
                        'phone',
                        'email',
                        'whatsapp'
                    );
                END IF;
            END$$;
        `);

        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'client_type_enum') THEN
                    CREATE TYPE public.client_type_enum AS ENUM (
                        'admin',
                        'mechanic',
                        'client'
                    );
                END IF;
            END$$;
        `);

        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'mechanic_experiencelevel_enum') THEN
                    CREATE TYPE public.mechanic_experiencelevel_enum AS ENUM (
                        'trainee',
                        'junior',
                        'senior',
                        'expert',
                        'master'
                    );
                END IF;
            END$$;
        `);

        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'mechanic_status_enum') THEN
                    CREATE TYPE public.mechanic_status_enum AS ENUM (
                        'active',
                        'inactive',
                        'busy',
                        'on_break',
                        'sick_leave'
                    );
                END IF;
            END$$;
        `);

        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'mechanic_type_enum') THEN
                    CREATE TYPE public.mechanic_type_enum AS ENUM (
                        'admin',
                        'mechanic',
                        'client'
                    );
                END IF;
            END$$;
        `);

        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_payment_method_enum') THEN
                    CREATE TYPE public.order_payment_method_enum AS ENUM (
                        'cash',
                        'card',
                        'transfer',
                        'qr'
                    );
                END IF;
            END$$;
        `);

        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status_enum') THEN
                    CREATE TYPE public.order_status_enum AS ENUM (
                        'pending',
                        'in_progress',
                        'completed'
                    );
                END IF;
            END$$;
        `);

        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'reservate_state_enum') THEN
                    CREATE TYPE public.reservate_state_enum AS ENUM (
                        'pending',
                        'in_progress',
                        'completed'
                    );
                END IF;
            END$$;
        `);

        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role_enum') THEN
                    CREATE TYPE public.user_role_enum AS ENUM (
                        'admin',
                        'user'
                    );
                END IF;
            END$$;
        `);

        // Crear tablas solo si no existen
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS public.client (
                client_id SERIAL PRIMARY KEY,
                client_code integer NOT NULL UNIQUE,
                name character varying(50) NOT NULL,
                last_name character varying(80) NOT NULL,
                phone character varying(10) NOT NULL UNIQUE,
                ci integer UNIQUE,
                type public.client_type_enum DEFAULT 'client'::public.client_type_enum NOT NULL,
                gender public.client_gender_enum NOT NULL,
                email character varying(100) UNIQUE,
                password character varying(255),
                email_verified boolean DEFAULT false NOT NULL,
                phone_verified boolean DEFAULT false NOT NULL,
                last_login timestamp without time zone,
                address text,
                preferred_contact_method public.client_preferred_contact_method_enum DEFAULT 'phone'::public.client_preferred_contact_method_enum NOT NULL,
                is_active boolean DEFAULT true NOT NULL,
                created_at timestamp without time zone DEFAULT now() NOT NULL,
                updated_at timestamp without time zone DEFAULT now() NOT NULL
            );
        `);

        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS public.vehicle (
                vehicle_id SERIAL PRIMARY KEY,
                board character varying(20) NOT NULL,
                model character varying(20) NOT NULL,
                brand character varying(50) NOT NULL,
                year integer NOT NULL
            );
        `);

        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS public.mechanic (
                mechanic_id SERIAL PRIMARY KEY,
                employee_code character varying(20) NOT NULL UNIQUE,
                first_name character varying(100) NOT NULL,
                last_name character varying(100) NOT NULL,
                phone character varying(20),
                type public.mechanic_type_enum DEFAULT 'mechanic'::public.mechanic_type_enum NOT NULL,
                hire_date date DEFAULT ('now'::text)::date NOT NULL,
                years_experience integer DEFAULT 0 NOT NULL,
                "experienceLevel" public.mechanic_experiencelevel_enum DEFAULT 'trainee'::public.mechanic_experiencelevel_enum NOT NULL,
                status public.mechanic_status_enum DEFAULT 'active'::public.mechanic_status_enum NOT NULL,
                specialties text,
                hourly_rate numeric(8,2),
                work_schedule_start time without time zone DEFAULT '08:00:00'::time without time zone NOT NULL,
                work_schedule_end time without time zone DEFAULT '17:00:00'::time without time zone NOT NULL,
                work_days text DEFAULT 'Monday,Tuesday,Wednesday,Thursday,Friday'::text NOT NULL,
                is_active boolean DEFAULT true NOT NULL,
                created_at timestamp without time zone DEFAULT now() NOT NULL,
                updated_at timestamp without time zone DEFAULT now() NOT NULL
            );
        `);

        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS public.service (
                service_id SERIAL PRIMARY KEY,
                code integer UNIQUE,
                title character varying(100) NOT NULL,
                description character varying(100) NOT NULL,
                price integer NOT NULL
            );
        `);

        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS public.reservate (
                reservate_id SERIAL PRIMARY KEY,
                code_reservate bigint NOT NULL UNIQUE,
                reservation_date timestamp without time zone NOT NULL,
                total_price integer NOT NULL,
                state public.reservate_state_enum DEFAULT 'pending'::public.reservate_state_enum NOT NULL,
                created_at timestamp without time zone DEFAULT now() NOT NULL,
                updated_at timestamp without time zone DEFAULT now() NOT NULL,
                "clientId" integer,
                "mechanicId" integer
            );
        `);

        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS public.client_vehicle (
                id SERIAL PRIMARY KEY,
                client_code integer,
                vehicle_id integer,
                is_primary boolean DEFAULT false NOT NULL,
                notes character varying(500),
                is_active boolean DEFAULT true NOT NULL,
                added_date timestamp without time zone DEFAULT now() NOT NULL,
                updated_at timestamp without time zone DEFAULT now() NOT NULL
            );
        `);

        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS public."order" (
                order_id SERIAL PRIMARY KEY,
                order_code character varying(20) NOT NULL UNIQUE,
                status public.order_status_enum DEFAULT 'pending'::public.order_status_enum NOT NULL,
                diagnosis text,
                work_description text,
                start_date timestamp without time zone,
                completion_date timestamp without time zone,
                client_nit_ci bigint NOT NULL,
                client_name character varying(150) NOT NULL,
                client_email character varying(100),
                subtotal numeric(10,2) DEFAULT '0'::numeric NOT NULL,
                tax_amount numeric(10,2) DEFAULT '0'::numeric NOT NULL,
                total_cost numeric(10,2) DEFAULT '0'::numeric NOT NULL,
                payment_method public.order_payment_method_enum DEFAULT 'cash'::public.order_payment_method_enum NOT NULL,
                invoice_number character varying(50),
                created_at timestamp without time zone DEFAULT now() NOT NULL,
                updated_at timestamp without time zone DEFAULT now() NOT NULL,
                reservate_id integer,
                vehicle_id integer,
                mechanic_id integer
            );
        `);

        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS public.mechanic_services (
                mechanic_id integer NOT NULL,
                service_id integer NOT NULL,
                PRIMARY KEY (mechanic_id, service_id)
            );
        `);

        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS public.reservate_service (
                reservate_id integer NOT NULL,
                service_id integer NOT NULL,
                PRIMARY KEY (reservate_id, service_id)
            );
        `);

        // Añadir foreign keys y constraints solo si no existen
        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM pg_constraint 
                    WHERE conname = 'FK_f12ed90ea192b020d0e41ded42b'
                ) THEN
                    ALTER TABLE public.reservate 
                    ADD CONSTRAINT "FK_f12ed90ea192b020d0e41ded42b" 
                    FOREIGN KEY ("clientId") REFERENCES public.client(client_id) ON DELETE SET NULL;
                END IF;
            END$$;
        `);

        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM pg_constraint 
                    WHERE conname = 'FK_5dde18e6e5de3e9db681c5a2c8e'
                ) THEN
                    ALTER TABLE public.reservate 
                    ADD CONSTRAINT "FK_5dde18e6e5de3e9db681c5a2c8e" 
                    FOREIGN KEY ("mechanicId") REFERENCES public.mechanic(mechanic_id) ON DELETE SET NULL;
                END IF;
            END$$;
        `);

        // Continuar con las demás foreign keys...
        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM pg_constraint 
                    WHERE conname = 'FK_fe338d2fea1f7ddf78e889c5c12'
                ) THEN
                    ALTER TABLE public.client_vehicle 
                    ADD CONSTRAINT "FK_fe338d2fea1f7ddf78e889c5c12" 
                    FOREIGN KEY (client_code) REFERENCES public.client(client_code) ON DELETE SET NULL;
                END IF;
            END$$;
        `);

        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM pg_constraint 
                    WHERE conname = 'FK_8eb7b966db2373e0a325ca25ef0'
                ) THEN
                    ALTER TABLE public.client_vehicle 
                    ADD CONSTRAINT "FK_8eb7b966db2373e0a325ca25ef0" 
                    FOREIGN KEY (vehicle_id) REFERENCES public.vehicle(vehicle_id) ON DELETE SET NULL;
                END IF;
            END$$;
        `);

        // Crear índices solo si no existen
        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS "IDX_8e253505ac6e35770253dd216b" 
            ON public.mechanic_services USING btree (mechanic_id);
        `);
        
        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS "IDX_3c2eff14f521f952cf741d00c4" 
            ON public.mechanic_services USING btree (service_id);
        `);

        console.log('✅ Migración inicial completada exitosamente');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Eliminar procedimientos almacenados
        await queryRunner.query(`DROP PROCEDURE IF EXISTS public.sp_insert_vehicle;`);
        await queryRunner.query(`DROP PROCEDURE IF EXISTS public.sp_insert_service;`);
        await queryRunner.query(`DROP PROCEDURE IF EXISTS public.sp_insert_client;`);

        // Eliminar tablas en orden correcto (respetando foreign keys)
        await queryRunner.query(`DROP TABLE IF EXISTS public.reservate_service;`);
        await queryRunner.query(`DROP TABLE IF EXISTS public.mechanic_services;`);
        await queryRunner.query(`DROP TABLE IF EXISTS public."order";`);
        await queryRunner.query(`DROP TABLE IF EXISTS public.client_vehicle;`);
        await queryRunner.query(`DROP TABLE IF EXISTS public.reservate;`);
        await queryRunner.query(`DROP TABLE IF EXISTS public.service;`);
        await queryRunner.query(`DROP TABLE IF EXISTS public.mechanic;`);
        await queryRunner.query(`DROP TABLE IF EXISTS public.vehicle;`);
        await queryRunner.query(`DROP TABLE IF EXISTS public.client;`);

        // Eliminar tipos ENUM
        await queryRunner.query(`DROP TYPE IF EXISTS public.user_role_enum;`);
        await queryRunner.query(`DROP TYPE IF EXISTS public.reservate_state_enum;`);
        await queryRunner.query(`DROP TYPE IF EXISTS public.order_status_enum;`);
        await queryRunner.query(`DROP TYPE IF EXISTS public.order_payment_method_enum;`);
        await queryRunner.query(`DROP TYPE IF EXISTS public.mechanic_type_enum;`);
        await queryRunner.query(`DROP TYPE IF EXISTS public.mechanic_status_enum;`);
        await queryRunner.query(`DROP TYPE IF EXISTS public.mechanic_experiencelevel_enum;`);
        await queryRunner.query(`DROP TYPE IF EXISTS public.client_type_enum;`);
        await queryRunner.query(`DROP TYPE IF EXISTS public.client_preferred_contact_method_enum;`);
        await queryRunner.query(`DROP TYPE IF EXISTS public.client_gender_enum;`);
    }

}
