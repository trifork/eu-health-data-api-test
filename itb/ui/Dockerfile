FROM isaitb/gitb-ui:1.30.2@sha256:e7f017dd83d142d56f0b2d8acd729f1a14bbe5bcb2bdfa2f8f4759b42866b8d9 AS stock

FROM python:3.12-alpine AS formatter
COPY --from=stock /usr/local/gitb-ui/lib/com.gitb.gitb-ui-1.0-SNAPSHOT-assets.jar /work/original.jar
COPY patch-assets.py json-viewer.js /work/
RUN python /work/patch-assets.py /work/original.jar /work/formatted.jar

FROM stock
COPY --from=formatter /work/formatted.jar /usr/local/gitb-ui/lib/com.gitb.gitb-ui-1.0-SNAPSHOT-assets.jar
