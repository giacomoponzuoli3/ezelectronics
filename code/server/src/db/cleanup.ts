"use strict"

import { run } from "node:test";
import db from "../db/db";

/**
 * Deletes all data from the database.
 * This function must be called before any integration test, to ensure a clean database state for each test run.
 */

export function cleanup() {
    
        // Delete all data from the database.
        db.run("DELETE FROM users");
        //Add delete statements for other tables here
        db.run("DELETE FROM review");
        db.run("DELETE FROM cartProduct");
        db.run("DELETE FROM cart");
        db.run("DELETE FROM productDescriptor")
    
}