# Change Log

## 0.0.1
Initial release

## 0.0.2

Added some metadata.

## 0.0.3

### New configurations: 
#### `open-all-files.recursive`
- Default value: `false`.

#### `open-all-files.maxFilesWithoutConfirmation`
- Default value: `10`.
- To always request confirmation: `0`.
- To never request confirmation: `-1`.

A new information message will be shown if no files were found in the selected folder (based on the recursive configuration). The message will not be shown if files were found but none of them was a text file, resulting in no files open at all.

## 0.0.4

Added a description for the "recursive" configuration.