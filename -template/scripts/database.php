<?php

/**
 * JsonDatabase class for managing a JSON-based database system.
 * This class allows creation, deletion, and management of databases and tables stored as JSON files.
 */
class JsonDatabase
{

    private $baseDir;

    /**
     * Constructor to initialize the base directory for the JSON database.
     *
     * @param string $baseDir The base directory where databases are stored.
     */
    public function __construct(string $baseDir = 'database')
    {
        $this->baseDir = $baseDir;
        $this->ensureBaseDirExists();
    }

    /**
     * Ensures that the base directory exists, creates it if it doesn't.
     */
    private function ensureBaseDirExists()
    {
        if (!is_dir($this->baseDir)) {
            mkdir($this->baseDir, 0775, true);
        }
    }

    /**
     * Checks if a database exists.
     *
     * @param string $name The name of the database.
     * @return bool True if the database exists, false otherwise.
     */
    public function databaseExists(string $name): bool
    {
        return is_dir(rtrim($this->baseDir, '/') . '/' . $name);
    }

    /**
     * Creates a new database.
     *
     * @param string $name The name of the new database.
     * @throws Exception If the database already exists.
     */
    public function CreateDatabase(string $name): void
    {
        if ($this->databaseExists($name)) {
            throw new Exception("Database '$name' already exists");
        }
        mkdir(rtrim($this->baseDir, '/') . '/' . $name, 0775, true);
    }

    /**
     * Creates a new table in an existing database.
     *
     * @param string $databaseName The name of the database.
     * @param string $tableName The name of the new table.
     * @throws Exception If the database does not exist or the table already exists.
     */
    public function CreateTable(string $databaseName, string $tableName): void
    {
        if (!$this->databaseExists($databaseName)) {
            throw new Exception("Database '$databaseName' does not exist");
        }
        $tableDir = $this->getTableDir($databaseName, $tableName);
        if (is_dir($tableDir)) {
            throw new Exception("Table '$tableName' already exists in database '$databaseName'");
        }
        mkdir($tableDir, 0775, true);
    }

    /**
     * Checks if a table exists in a given database.
     *
     * @param string $databaseName The name of the database.
     * @param string $tableName The name of the table.
     * @return bool True if the table exists, false otherwise.
     */
    public function tableExists(string $databaseName, string $tableName): bool
    {
        if (!$this->databaseExists($databaseName)) {
            return false;
        }
        return is_dir($this->getTableDir($databaseName, $tableName));
    }

    /**
     * Retrieves the structure of a database including its tables.
     *
     * @param string $name The name of the database.
     * @return array An associative array representing the database and its tables.
     * @throws Exception If the database does not exist.
     */
    public function GetDatabase(string $name): array
    {
        if (!$this->databaseExists($name)) {
            throw new Exception("Database '$name' does not exist");
        }

        $tables = [];
        $databaseDir = rtrim($this->baseDir, '/') . '/' . $name;
        $subdirs = scandir($databaseDir);
        foreach ($subdirs as $subdir) {
            if (in_array($subdir, ['.', '..']))
                continue;
            if (is_dir($databaseDir . '/' . $subdir)) {
                $tables[$subdir] = $this->getTableEntries($databaseDir . '/' . $subdir);
            }
        }
        return $tables;
    }

    /**
     * Inserts a new entry into a specified table in a database.
     *
     * @param string $databaseName The name of the database.
     * @param string $tableName The name of the table.
     * @param array $data The data to insert as an associative array.
     * @return string The unique ID of the inserted entry.
     * @throws Exception If the table does not exist or the entry insertion fails.
     */
    public function InsertEntry(string $databaseName, string $tableName, array $data): string
    {
        if (!$this->tableExists($databaseName, $tableName)) {
            throw new Exception("Table '$tableName' does not exist in database '$databaseName'");
        }
        $tableDir = $this->getTableDir($databaseName, $tableName);
        $this->ensureTableDirExists($tableDir);

        $entryId = uniqid();
        $fileName = $entryId . '.json';
        $filePath = $tableDir . '/' . $fileName;
        if (file_put_contents($filePath, json_encode($data, JSON_PRETTY_PRINT)) === false) {
            throw new Exception("Failed to insert entry into table '$tableName' of database '$databaseName'");
        }
        return $entryId;
    }

    /**
     * Retrieves an entry from a specified table in a database.
     *
     * @param string $databaseName The name of the database.
     * @param string $tableName The name of the table.
     * @param string $entryId The unique ID of the entry.
     * @return array The data of the entry as an associative array.
     * @throws Exception If the table or entry does not exist.
     */
    public function GetEntry(string $databaseName, string $tableName, string $entryId): array
    {
        if (!$this->tableExists($databaseName, $tableName)) {
            throw new Exception("Table '$tableName' does not exist in database '$databaseName'");
        }

        $filePath = $this->getEntryPath($databaseName, $tableName, $entryId);
        if (!file_exists($filePath)) {
            throw new Exception("Entry '$entryId' does not exist in table '$tableName' of database '$databaseName'");
        }
        $data = file_get_contents($filePath);
        return json_decode($data, true) ?: [];
    }

    /**
     * Deletes an entry from a specified table in a database.
     *
     * @param string $databaseName The name of the database.
     * @param string $tableName The name of the table.
     * @param string $entryId The unique ID of the entry to delete.
     * @return bool True if the entry was successfully deleted, false otherwise.
     * @throws Exception If the table does not exist.
     */
    public function DeleteEntry(string $databaseName, string $tableName, string $entryId): bool
    {
        if (!$this->tableExists($databaseName, $tableName)) {
            throw new Exception("Table '$tableName' does not exist in database '$databaseName'");
        }

        $filePath = $this->getEntryPath($databaseName, $tableName, $entryId);
        if (!file_exists($filePath)) {
            return false; // Entry already deleted
        }
        return unlink($filePath);
    }

    /**
     * Deletes a table from a specified database.
     *
     * @param string $databaseName The name of the database.
     * @param string $tableName The name of the table to delete.
     * @return bool True if the table was successfully deleted, false otherwise.
     * @throws Exception If the table does not exist.
     */
    public function DeleteTable(string $databaseName, string $tableName): bool
    {
        if (!$this->tableExists($databaseName, $tableName)) {
            throw new Exception("Table '$tableName' does not exist in database '$databaseName'");
        }

        $tableDir = $this->getTableDir($databaseName, $tableName);
        return $this->deleteDir($tableDir);
    }

    /**
     * Deletes an entire database.
     *
     * @param string $databaseName The name of the database to delete.
     * @return bool True if the database was successfully deleted, false otherwise.
     * @throws Exception If the database does not exist.
     */
    public function DeleteDatabase(string $databaseName): bool
    {
        if (!$this->databaseExists($databaseName)) {
            throw new Exception("Database '$databaseName' does not exist");
        }

        $databaseDir = rtrim($this->baseDir, '/') . '/' . $databaseName;
        return $this->deleteDir($databaseDir);
    }

    /**
     * Counts the number of entries in a specified table.
     *
     * @param string $databaseName The name of the database.
     * @param string $tableName The name of the table.
     * @return int The number of entries in the table.
     * @throws Exception If the table does not exist.
     */
    public function CountEntries(string $databaseName, string $tableName): int
    {
        if (!$this->tableExists($databaseName, $tableName)) {
            throw new Exception("Table '$tableName' does not exist in database '$databaseName'");
        }

        $tableDir = $this->getTableDir($databaseName, $tableName);
        $files = scandir($tableDir);
        $count = 0;
        foreach ($files as $file) {
            if (pathinfo($file, PATHINFO_EXTENSION) === 'json') {
                $count++;
            }
        }
        return $count;
    }

    /**
     * Retrieves the directory path for a specified table.
     *
     * @param string $databaseName The name of the database.
     * @param string $tableName The name of the table.
     * @return string The directory path of the table.
     */
    private function getTableDir(string $databaseName, string $tableName): string
    {
        return rtrim($this->baseDir, '/') . '/' . $databaseName . '/' . $tableName;
    }

    /**
     * Ensures that the table directory exists, creates it if it doesn't.
     *
     * @param string $tableDir The directory path of the table.
     */
    private function ensureTableDirExists(string $tableDir)
    {
        if (!is_dir($tableDir)) {
            mkdir($tableDir, 0775, true);
        }
    }

    /**
     * Retrieves the file path for a specified entry in a table.
     *
     * @param string $databaseName The name of the database.
     * @param string $tableName The name of the table.
     * @param string $entryId The unique ID of the entry.
     * @return string The file path of the entry.
     */
    private function getEntryPath(string $databaseName, string $tableName, string $entryId): string
    {
        return $this->getTableDir($databaseName, $tableName) . '/' . $entryId . '.json';
    }

    /**
     * Retrieves the entries of a table as an array of entry IDs.
     *
     * @param string $tableDir The directory path of the table.
     * @return array An array of entry IDs.
     */
    private function getTableEntries(string $tableDir): array
    {
        $entries = [];
        $files = scandir($tableDir);
        foreach ($files as $file) {
            if (pathinfo($file, PATHINFO_EXTENSION) === 'json') {
                $entries[] = pathinfo($file, PATHINFO_FILENAME);
            }
        }
        return $entries;
    }

    /**
     * Recursively deletes a directory and its contents.
     *
     * @param string $dirPath The directory path to delete.
     * @return bool True if the directory was successfully deleted, false otherwise.
     */
    private function deleteDir(string $dirPath): bool
    {
        if (!is_dir($dirPath)) {
            return false;
        }
        $files = array_diff(scandir($dirPath), ['.', '..']);
        foreach ($files as $file) {
            $filePath = "$dirPath/$file";
            is_dir($filePath) ? $this->deleteDir($filePath) : unlink($filePath);
        }
        return rmdir($dirPath);
    }
}