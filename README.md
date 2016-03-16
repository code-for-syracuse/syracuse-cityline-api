# SYRCityLine API

[SYRCityLine](http://cityline.syrgov.net/) is a service from the City of Syracuse for submitting services requests and tracking complaints, permits and permit applications. While this service is helpful, there is no API for looking up the status of records (e.g., to programmatically check the status of a complaint or permit).

This project attempts to create an API for th SYRCityLine service.

## Usage

Look up the status of a complaint or service request:

```curl
~$ curl https://apis.opensyracuse.org/cityline/complaint/2013-27037
```

Response:

```json
{
  "violations": "No violations on record for this complaint ",
  "id": "Complaint/Service Request Record #: 2013-27037",
  "type": "DeadAnimal in Right ofWay",
  "status": "Completed",
  "address": "Parcel: 1500 Geddes St S & Bellevue Av, Syracuse 13205",
  "dates": null,
  "description": "  dead cat",
  "actions": "11/12/2013 Nothing There ",
  "inspections": "No inspections on record for this complaint "
}
```

Look up a permit application:

```curl
~$ curl https://apis.opensyracuse.org/cityline/application/PC-0222-14
```

Response:

```json
{
  "violations": null,
  "id": "PC-0222-14",
  "type": "Sidewalk Cafe",
  "status": "Issued",
  "address": "234-48 Willow St W & Franklin St, Syracuse 13202",
  "dates": "5/23/2014",
  "description": "Sidewalk cafe outside of Dinosaur BBQ. No FPB approval needed. Alochol to be served.",
  "actions": null,
  "inspections": null
}
```

Look up a permit:

```curl
~$ curl https://apis.opensyracuse.org/cityline/permit/05521
```

Response:

```json
{
  "violations": null,
  "id": "05521",
  "type": "Res. Remodel/Chg Occ",
  "status": "Void",
  "address": "1500 Geddes St S & Bellevue Av, Syracuse 13205",
  "dates": "Issued: 3/6/2012, Expires: 9/6/2013",
  "description": "Repair roof with 1/2' plywood, felt, ice and water shield at eves, vallies, and perimiter and shingles. Contractor shall maintain the construction safeguards of NYSEBC, & NYSFC chapter 14.",
  "actions": null,
  "inspections": null
}
```

Note: JSONP is supported by using a ```callback``` parameter with requests.
