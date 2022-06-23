# Ticket Breakdown

We are a staffing company whose primary purpose is to book Agents at Shifts posted by Facilities on our platform. We're working on a new feature which will generate reports for our client Facilities containing info on how many hours each Agent worked in a given quarter by summing up every Shift they worked. Currently, this is how the process works:

- Data is saved in the database in the Facilities, Agents, and Shifts tables
- A function `getShiftsByFacility` is called with the Facility's id, returning all Shifts worked that quarter, including some metadata about the Agent assigned to each
- A function `generateReport` is then called with the list of Shifts. It converts them into a PDF which can be submitted by the Facility for compliance.

## You've been asked to work on a ticket. It reads:

**Currently, the id of each Agent on the reports we generate is their internal database id. We'd like to add the ability for Facilities to save their own custom ids for each Agent they work with and use that id when generating reports for them.**

Based on the information given, break this ticket down into 2-5 individual tickets to perform. Provide as much detail for each ticket as you can, including acceptance criteria, time/effort estimates, and implementation details. Feel free to make informed guesses about any unknown details - you can't guess "wrong".

You will be graded on the level of detail in each ticket, the clarity of the execution plan within and between tickets, and the intelligibility of your language. You don't need to be a native English speaker, but please proof-read your work.

## Your Breakdown Here

So basically we need the facilities to have a functionality to create their custom ids for any agent that works for them. We need to store a mapping [custom id <-> internal db id] on a separate table.

**Assumptions**:

- Facilities have an UI interface to view each _Booking_ they get.
- Our apps are HTTP based: UI interface is accessible on browser and it connects to our REST API server

### 1. Create an UI interface where facility manager can add custom id to an agent

**Description**:
An additional page or a functionality in the existing _View booking page_ where we view a list of all agents in that booking. The USER(in this case the Facility manager/admin) can only add/edit custom id for an Agent.

**Acceptance Criteria**

- This UI interface is only available to USER
- USER can view the exisiting custom id of any agent
- USER can add/edit a custom id for an agent

**Estimates**: 8h

### 2. Create a new table to store custom id for agents for any Agent booked for a Facility

**Description**:
Create a custom id table(using db migration) which will store this mapping: FacilityId - AgentId - CustomId

**Acceptance Criteria**

- Custom id is store for an agent for a facilty
- An agent can't have multiple custom ids for a single facility
- An agent's custom id for a facility can be updated

**Estimate**: 1h

### 3. Create an API for updating the custom id of an agent for a Facility

**Description**
Create an REST API endpoints which can be used to view and update/edit custom id for an Agent for an Facility.

For GET operation

- Request Fields: `facilityId`, `agentId`
- Response Fields: `customId`, `facilityId`, `agentId`

For POST operation

- Request Fields: `customId`, `facilityId`, `agentId`
- Response Fields: `customId`, `facilityId`, `agentId`

**Acceptance Criteria**

- The operations on this api endpoints can only be performed by the facility manager/admin
- POST operation should update or create an entry in the custom id table
- GET operation should fetch the existing custom id for an agent of the facility
- for GET operation - api should return 404 for non existing agent or facility ids
- for POST operation - api should give an error response if the agentId or facilityId is invalid/non existent

**Estimate**: 4h

### 4. Custom id need to shown when agents in a booking

**Description**: When viewing a booking. The agents custom id should be shown insted of the internal `agentId`. Update the api and the ui application to reflect this

**Acceptance Criteria**

- When viewing a booking. The agents custom id should be shown insted of the internal `agentId`

**Esitmate**: 2h

### 5. Add the custom id to generated reports

**Description**:
When the `getShiftsByFacility(facilityId)` is called, the Agents metadata should now contain an additonal `customId` field which contains the custom id of Agent for the Facility with id `facilityId`

**Acceptance Criteria**

- The agent metadata in the return value of getShiftsByFacility must have an additonal `customId` field _if_ a custom id has been created for the agent by the facility manager/admin
- If no `customId` has be created then the field should not return any value
- `generateReport` now should show the custom id of the agent(if they have an custom id created for them) in the generated reports

**Estimate**: 8h
