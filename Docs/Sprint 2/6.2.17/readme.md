# US 6.2.17

## 1. Context

* Implement functionality in the frontend so that the doctor can list/search operation requisitions to be able to see the detalils, edit and remove operation requisitions.

## 2. Requirements

**US 6.2.17** As a Doctor, I want to list/search operation requisitions, so that I see the details, edit, and remove operation requisitions.

**Acceptance criteria:**
- Doctors can search operation requests by patient name, operation type, priority, and status.
- The system displays a list of operation requests in a searchable and filterable view.
- Each entry in the list includes operation request details (e.g., patient name, operation type,
status).
- Doctors can select an operation request to view, update, or delete it.

## 3. Analysis

* **Q** – In the project document it mentions that each operation has a priority. How is a operation's priority defined? Do they have priority levels defined? Is it a scale? Or any other system?
  * **A**: 
    - Elective Surgery: A planned procedure that is not life-threatening and can be scheduled at a convenient time (e.g., joint replacement, cataract surgery).
    - Urgent Surgery: Needs to be done sooner but is not an immediate emergency. Typically within days (e.g., certain types of cancer surgeries).
    - Emergency Surgery: Needs immediate intervention to save life, limb, or function. Typically performed within hours (e.g., ruptured aneurysm, trauma).
* **Q**: Can the same doctor who requests a surgery perform it?
  * **A**: Not necessarily. The planning module may assign different doctors based on availability and optimization.
* **Q**: What does “status” refer to in the context of searching for operating requisitions?
  * **A**: Status refers to whether the operation is planned or requested.
* **Q**: Good afternoon, 
  In the acceptance criteria for US19 - "As a Doctor, I want to list/search operation requisitions, so that I can see the details, edit, and remove operation requisitions," one of the criteria specifies: "- The system displays a list of operation requests in a searchable and filterable view." 
  Could you please clarify which filters the doctor can apply to the Operation Requisition search?
  * **A**: the doctor can search and filter by operation type, patient name, patient medical record number, date range.
* **Q**: When listing operation requests, should only the operation requests associated to the logged-in doctor be displayed?
  * **A**: a doctor can see the operation requests they have submitted as well as the operation requests of a certain patient.
an Admin will be able to list all operation requests and filter by doctor
it should be possible to filter by date of requeste, priority and expected due date
***


## 4. Design

### 4.1. Realization
#### Level 1
![Sequence Diagram](svg/SequenceDiagram_Lvl1.svg)
##### Level 2
![Sequence Diagram](svg/SequenceDiagram_Lvl2.svg)

##### Level 3
![Sequence Diagram](svg/SequenceDiagram_Lvl3.svg)

### 4.2. Class Diagram

![Class Diagram](svg/ClassDiagram.svg)

### 4.3. Applied Patterns

Applied Patterns description in [DevelopmentPatterns](../Global/DevelopmentPatterns/readme.md)

### 4.4. Tests

- **Search OperationRequest test**
```
  it('should create', () => {...});
  it('should sort data correctly', () => {...});
  it('should create operation request DTO correctly', () => {...});

  describe('Search Operation Requests with filters', () => {
    it('should search with filters', () => {...});
    it('should handle empty search results', () => {...});
  }
```
- **OperationRequestService test**

```
describe('OperationRequestService', () => {
  it('should be created', () => {...});

  it('should fetch all operation types', () => {...});
  it('should fetch all patients', () => {...});
  it('should fetch operation request by id', () => {...});

    
  it('should search operation requests with filters', () => {
    ...
    service.searchOperationRequestWithFilters('Urgent', 1, 'Patient 1', 'MR1', startDate, endDate).subscribe(operationRequests => {
      console.log("service op req " + operationRequests);
      expect(operationRequests.length).toBe(2);
      expect(operationRequests).toEqual(dummyOperationRequests);
    });
    

    const req = httpMock.expectOne(operationRequestsUrl + '/filter?' + filters.toString());

    expect(req.request.method).toBe('GET');
    req.flush(dummyOperationRequests);
  
  });
}
```

## 5. Implementation

- **OperationRequestController - Update()**

```
var operationTypeDto = await _service.UpdateAsync(dto);

if (operationTypeDto == null)
{
    return NotFound();
}
return Ok(operationTypeDto);
```

- **OperationRequestService - Update()**

```
...
operationRequest.Update(DateTime.Parse(dto.DeadlineDate), dto.Priority, requestedByDoctor, operationType, patient);

var newValues = operationRequest.ToString();
var changeLog = new SystemChangeLog(
    tableId: operationRequest.Id.AsString(),
    table: TABLE_NAME,
    oldValues: oldValues,
    newValues: newValues,
    changedBy: "Doctor",
    logType: "Edit"
);

await _changeLogRepository.AddAsync(changeLog);

await this._unitOfWork.CommitAsync();
...
```

## 6. Integration/Demonstration

- To execute this functionality you must login into the system as Doctor and navigate to Search Operations Request.
Apply filters:
  - Patient Name
  - Patient medical record number
  - Operation type
  - Priority
  - Deadline date range
- Press on search icon to update the list with filters
![Search Menu](./png/image.png)