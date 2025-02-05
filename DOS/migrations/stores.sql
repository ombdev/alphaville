--
-- Name: alter_user(integer, character varying, character varying, integer, boolean, character varying, character varying, integer[]); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.alter_user(_user_id integer, _username character varying, _passwd character varying, _role_id integer, _disabled boolean, _first_name character varying, _last_name character varying, _authorities integer[]) RETURNS record
    LANGUAGE plpgsql
    AS $$
DECLARE
    -- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    -- >> Description: Create/Edit user                                             >>
    -- >> Version:     nina_fresa                                                   >>
    -- >> Date:        04/ago/2021                                                  >>
    -- >> Developer:   Omar Montes                                                  >>
    -- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    current_moment timestamp with time zone := now();
    last_id integer := 0;
	row_counter integer := 0;
	arr_len integer := 0;
	i integer := 0;

    -- dump of errors
    rmsg text := '';

BEGIN

    CASE
        WHEN _user_id = 0 THEN

            INSERT INTO users (
                username,
                passwd,
                role_id,
				disabled,
				first_name,
				last_name,
				last_touch_time,
                creation_time
            ) VALUES (
                _username,
                _passwd,
                _role_id,
				_disabled,
				_first_name,
				_last_name,
                current_moment,
                current_moment
            ) RETURNING id INTO last_id;

			arr_len := array_length(_authorities, 1);
			if arr_len is not NULL then

				for i in 1 .. arr_len loop
					insert into users_authorities values (last_id, _authorities[i]);
				end loop;

			end if;

        WHEN _user_id > 0 THEN

			if _passwd = '' then
				
				UPDATE users
				SET username = _username,
					role_id = _role_id,
					disabled = _disabled,
					first_name = _first_name,
					last_name = _last_name,
					last_touch_time = current_moment
				WHERE id = _user_id;
			
			else
				
				UPDATE users
				SET username = _username,
					passwd = _passwd,
					role_id = _role_id,
					disabled = _disabled,
					first_name = _first_name,
					last_name = _last_name,
					last_touch_time = current_moment
				WHERE id = _user_id;
			
			end if;
			
			GET DIAGNOSTICS row_counter = ROW_COUNT;
			if row_counter <> 1 then
				RAISE EXCEPTION 'user identifier % does not exist', _user_id;
			end if;

			delete from users_authorities where user_id = _user_id;

			arr_len := array_length(_authorities, 1);
			if arr_len is not NULL then

				for i in 1 .. arr_len loop
					insert into users_authorities values (_user_id, _authorities[i]);
				end loop;

			end if;

            -- Upon edition we return user id as last id
            last_id = _user_id;

        ELSE
            RAISE EXCEPTION 'negative user identifier % is unsupported', _user_id;

    END CASE;

    return ( last_id::integer, ''::text );

    EXCEPTION
        WHEN OTHERS THEN
            GET STACKED DIAGNOSTICS rmsg = MESSAGE_TEXT;
            return ( -1::integer, rmsg::text );

END;
$$;


ALTER FUNCTION public.alter_user(_user_id integer, _username character varying, _passwd character varying, _role_id integer, _disabled boolean, _first_name character varying, _last_name character varying, _authorities integer[]) OWNER TO postgres;



CREATE FUNCTION public.alter_equipment(_equipment_id integer, _code character varying, _title character varying, _unit_cost numeric) RETURNS record
    LANGUAGE plpgsql
    AS $$
DECLARE
    -- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    -- >> Description: Create/Edit equipment     >>
    -- >> Version:     nina_fresa                >>
    -- >> Date:        20/ago/2021               >>
    -- >> Developer:   Edwin Plauchu Camacho     >>
    -- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    current_moment timestamp with time zone := now();

    -- dump of errors
    rmsg text := '';

BEGIN

    CASE
        WHEN _equipment_id = 0 THEN

            INSERT INTO equipments(
                code,
                title,
				unit_cost,
                last_touch_time,
                creation_time,
                blocked
            )VALUES(
                _code,
                _title,
				_unit_cost,
                current_moment,
                current_moment,
                false
            )RETURNING id INTO _equipment_id;

        WHEN _equipment_id > 0 THEN

            UPDATE equipments
            SET code = _code,
                title = _title,
				unit_cost = _unit_cost,
                last_touch_time = current_moment
            WHERE id = _equipment_id;
            

        ELSE

            RAISE EXCEPTION 'negative equipment identifier % is unsupported', _equipment_id;

    END CASE;

    return ( _equipment_id::integer, ''::text );

    EXCEPTION
        WHEN OTHERS THEN
            GET STACKED DIAGNOSTICS rmsg = MESSAGE_TEXT;
            return ( -1::integer, rmsg::text );

END;
$$;



CREATE FUNCTION public.alter_patio(
    _patio_id INT,
    _code character varying,
    _title character varying
) RETURNS record
    LANGUAGE plpgsql
    AS $$
DECLARE
    -- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    -- >> Description: Create/Edit patio                                            >>
    -- >> Version:     nina_fresa                                                   >>
    -- >> Date:        19/ago/2021                                                  >>
    -- >> Developer:   Alvaro Gamez Chavez                                          >>
    -- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    current_moment timestamp with time zone := now();

    -- dump of errors
    rmsg text := '';

BEGIN

    CASE
        WHEN _patio_id = 0 THEN

            INSERT INTO patios(
                code,
                title,
                last_touch_time,
                creation_time,
                blocked
            )VALUES(
                _code,
                _title,
                current_moment,
                current_moment,
                false
            )RETURNING id INTO _patio_id;

        WHEN _patio_id > 0 THEN


            UPDATE patios
            SET code = _code,
                title = _title,
                last_touch_time = current_moment
            WHERE id = _patio_id;
            

        ELSE

            RAISE EXCEPTION 'negative work yard identifier % is unsupported', _patio_id;


    END CASE;

    return ( _patio_id::integer, ''::text );

    EXCEPTION
        WHEN OTHERS THEN
            GET STACKED DIAGNOSTICS rmsg = MESSAGE_TEXT;
            return ( -1::integer, rmsg::text );

END;
$$;


CREATE FUNCTION public.alter_carrier(
    _carrier_id INT,
    _code character varying,
    _title character varying,
    _disabled boolean
) RETURNS record
    LANGUAGE plpgsql
    AS $$
DECLARE
    -- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    -- >> Description: Create/Edit carrier                                          >>
    -- >> Version:     nina_fresa                                                   >>
    -- >> Date:        20/ago/2021                                                  >>
    -- >> Developer:   Alvaro Gamez Chavez                                          >>
    -- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

     current_moment timestamp with time zone := now();
     
    -- dump of errors
    rmsg text := '';

BEGIN

    CASE

       WHEN _carrier_id = 0 THEN

           INSERT INTO carriers(
               code,
               title,
               disabled,
               last_touch_time,
               creation_time,
               blocked
           )VALUES(
               _code,
               _title,
               _disabled,
               current_moment,
               current_moment,
               false
           ) RETURNING id INTO _carrier_id;

       WHEN _carrier_id > 0 THEN

           UPDATE carriers
           SET code = _code,
               title = _title,
               disabled = _disabled,
               last_touch_time = current_moment
           WHERE id = _carrier_id;
           
       ELSE
       
           RAISE EXCEPTION 'negative carrier identifier % is unsupported', _carrier_id;

   END CASE;
   
   RETURN(_carrier_id::integer,''::text);
   
   EXCEPTION

       WHEN others THEN
       
           GET STACKED DIAGNOSTICS rmsg = MESSAGE_TEXT;
           return ( -1::integer, rmsg::text );
   
END;
$$;


CREATE FUNCTION alter_unit(
    _unit_id INT,
    _code character varying,
    _title character varying
) RETURNS record
    LANGUAGE plpgsql
    AS $$
DECLARE
    -- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    -- >> Description: Create/Edit unit         >>
    -- >> Version:     nina_fresa               >>
    -- >> Date:        19/ago/2021              >>
    -- >> Developer:   Alvaro Gamez Chavez      >>
    -- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    current_moment timestamp with time zone := now();

    -- dump of errors
    rmsg text := '';

BEGIN

    CASE
        WHEN _unit_id = 0 THEN

            INSERT INTO units(
                code,
                title,
                last_touch_time,
                creation_time,
                blocked
            )VALUES(
                _code,
                _title,
                current_moment,
                current_moment,
                false
            ) RETURNING id INTO _unit_id;

        WHEN _unit_id > 0 THEN


            UPDATE units
            SET code = _code,
                title = _title,
                last_touch_time = current_moment
            WHERE id = _unit_id;
            

        ELSE

            RAISE EXCEPTION 'negative unit identifier % is unsupported', _unit_id;


    END CASE;

    return ( _unit_id::integer, ''::text );

    EXCEPTION
        WHEN OTHERS THEN
            GET STACKED DIAGNOSTICS rmsg = MESSAGE_TEXT;
            return ( -1::integer, rmsg::text );

END;
$$;
