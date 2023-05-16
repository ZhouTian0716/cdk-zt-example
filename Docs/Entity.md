# Entity

## Database

We use dynamodb to store all data, and use `PK` as entity type

|  PK  |   Comment   |         Common property          |
| :--: | :---------: | :------------------------------: |
| USER | Client info | id, name, gender, contact number |

# Terminology

## User Types

`Client` - Customers whose information logged inside of our system
`User` - also known as `Agent`, people who can login to the system
`Admin` - Full access, who pay for the system, and can add user/agents and clients
