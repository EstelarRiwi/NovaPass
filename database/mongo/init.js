const db = db.getSiblingDB('estelar_logs');

// logs_auth
db.createCollection('logs_auth', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['timestamp', 'type', 'email', 'ip_address', 'payload'],
      properties: {
        timestamp:  { bsonType: 'date' },
        type:       { bsonType: 'string', enum: ['login_success', 'login_failed', 'register', 'password_change', 'token_invalidated', 'oauth_login'] },
        user_id:    { bsonType: ['string', 'null'] },
        email:      { bsonType: 'string' },
        ip_address: { bsonType: 'string' },
        user_agent: { bsonType: 'string' },
        payload:    { bsonType: 'object' }
      }
    }
  }
});
db.logs_auth.createIndex({ timestamp: -1 });
db.logs_auth.createIndex({ email: 1, timestamp: -1 });
db.logs_auth.createIndex({ user_id: 1 });

// logs_tickets
db.createCollection('logs_tickets', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['timestamp', 'type', 'ticket_id', 'event_id', 'payload'],
      properties: {
        timestamp:   { bsonType: 'date' },
        type:        { bsonType: 'string', enum: ['purchase_initiated', 'purchase_confirmed', 'sale_presential', 'qr_generated', 'cancellation'] },
        ticket_id:   { bsonType: 'string' },
        user_id:     { bsonType: ['string', 'null'] },
        employee_id: { bsonType: ['string', 'null'] },
        event_id:    { bsonType: 'string' },
        payload:     { bsonType: 'object' }
      }
    }
  }
});
db.logs_tickets.createIndex({ timestamp: -1 });
db.logs_tickets.createIndex({ ticket_id: 1 });
db.logs_tickets.createIndex({ event_id: 1, timestamp: -1 });
db.logs_tickets.createIndex({ user_id: 1 });

// logs_validation
db.createCollection('logs_validation', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['timestamp', 'type', 'employee_id', 'result', 'payload'],
      properties: {
        timestamp:   { bsonType: 'date' },
        type:        { bsonType: 'string', enum: ['qr_scan'] },
        ticket_id:   { bsonType: ['string', 'null'] },
        employee_id: { bsonType: 'string' },
        result:      { bsonType: 'string', enum: ['valid', 'invalid_signature', 'already_used'] },
        payload:     { bsonType: 'object' }
      }
    }
  }
});
db.logs_validation.createIndex({ timestamp: -1 });
db.logs_validation.createIndex({ employee_id: 1, timestamp: -1 });
db.logs_validation.createIndex({ 'payload.event_id': 1, result: 1, timestamp: -1 });

// logs_system
db.createCollection('logs_system', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['timestamp', 'type', 'severity', 'source', 'payload'],
      properties: {
        timestamp:   { bsonType: 'date' },
        type:        { bsonType: 'string', enum: ['api_error', 'mp_failure', 'n8n_timeout', 'audit_operation'] },
        severity:    { bsonType: 'string', enum: ['info', 'warning', 'error', 'critical'] },
        source:      { bsonType: 'string' },
        user_id:     { bsonType: ['string', 'null'] },
        employee_id: { bsonType: ['string', 'null'] },
        payload:     { bsonType: 'object' }
      }
    }
  }
});
db.logs_system.createIndex({ timestamp: -1 });
db.logs_system.createIndex({ severity: 1, timestamp: -1 });
db.logs_system.createIndex({ source: 1, timestamp: -1 });

print(' estelar_logs lista con 4 colecciones');

