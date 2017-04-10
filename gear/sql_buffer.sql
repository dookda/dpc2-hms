--create view hms_buff as SELECT gid, ST_Buffer(geom, 5, 'quad_segs=8') as geom from hms;
drop view hms_buff;
create view hms_buff as SELECT gid, ST_Buffer(ST_Transform(geom, 32647), 5000, 'quad_segs=8') as geom from hms