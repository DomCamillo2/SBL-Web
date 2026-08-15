# Docker Hosting Sketch — Multi-Client KMU Sites

## Zielbild

Ein VPS hostet viele statische Kunden-Sites. Traefik terminiert TLS und routet per Hostname. Jeder Client ist ein isolierter Nginx-Container mit Resource Limits.

```
                    ┌──────────────────┐
   :80/:443         │     Traefik      │
───────────────────►│  Let's Encrypt   │
                    └────────┬─────────┘
           Host(`a.de`)      │      Host(`b.de`)
                ┌────────────┼────────────┐
                ▼            ▼            ▼
           ┌────────┐   ┌────────┐   ┌────────┐
           │nginx-a │   │nginx-b │   │nginx-c │
           │ static │   │ static │   │ static │
           └────────┘   └────────┘   └────────┘
```

## Verzeichnisvorschlag auf dem Server

```
/opt/sbl-web/
  traefik/
    docker-compose.yml
    traefik.yml
    acme.json
  clients/
    baeckerei-mueller/
      docker-compose.yml
      dist/          # oder Image aus Registry
    praxis-schmidt/
      docker-compose.yml
```

## Shared Traefik (edge)

Siehe `traefik.docker-compose.yml` und `traefik.yml`.

## Per-client stack

Siehe `client.docker-compose.yml`.

Labels reichen, damit Traefik die Route ohne manuelle Nginx-vhosts anlegt.

## Client Dockerfile (static)

Siehe `Dockerfile.static`.

Empfehlung: CI baut Image → Registry → Server pulled nur Images (kein Build auf Prod nötig).

## new-client.sh (Konzept)

1. Ordner `clients/<slug>` anlegen  
2. Compose aus Template mit Domain/Slug füllen  
3. `docker compose up -d`  
4. Staging: `<slug>.staging.example.com`  
5. Später Production-Domain als zweite Router-Rule  

## Sicherheit (Minimum)

- Docker Socket nicht roh an Traefik, wenn vermeidbar (Socket Proxy)
- Pro Container: `mem_limit`, `cpus`
- Networks: clients nur am proxy-network, keine Cross-Client-Links
- Backups der `acme.json` und Client-Volumes
- Fail2ban / Firewall: nur 80/443/22 offen

## Wann kein Static Nginx?

Nur wenn der Client SSR, Auth-Sessions oder Server-Forms braucht.  
Für klassische KMU-Marketingseiten: Static + externes Form-Endpoint (z. B. Formspree, eigener kleiner Forms-Service, oder Edge Function).
