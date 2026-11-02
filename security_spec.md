# Firebase Security Specification

## Data Invariants
1. `announcements`: Publicly readable by all visitors. Modifiable (create/update/delete) by authenticated bureau members/publishers.
2. `transactions`: Readable and writeable by members/treasurer to manage financial expenses and income transparently.
3. `activityBudgets`: Readable and writeable by members/treasurer to track planned and spent budgets.
4. `members`: Anyone can submit an online registration (`registrationSource: 'online_form'`). Bureau members/treasurer can read and manage member lists and mark fee payments.

## Collections & Access Matrix
- `/announcements/{id}`:
  - Read: Allow public read (anyone)
  - Write (create/update/delete): Allow write
- `/transactions/{id}`:
  - Read: Allow read
  - Write: Allow write
- `/activityBudgets/{id}`:
  - Read: Allow read
  - Write: Allow write
- `/members/{id}`:
  - Read: Allow read
  - Write: Allow write
