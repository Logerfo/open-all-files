# Change Log

## 0.0.7 - 2019-05-13
Removed the command from the palette.

## 0.0.6 - 2019-04-22
Not showing the context menu when the selected item is a file.

## 0.0.5 - 2019-03-13
Performance improvements.

## 0.0.4 - 2018-10-24
Added a description for the "recursive" configuration.  
Command name changed from `extension.openAllFiles` to `open-all-files.OpenAllFiles`.

## 0.0.3 - 2018-09-11
### New configurations: 
#### `open-all-files.recursive`
- Default value: `false`.

#### `open-all-files.maxFilesWithoutConfirmation`
- Default value: `10`.
- To always request confirmation: `0`.
- To never request confirmation: `-1`.

A new information message will be shown if no files were found in the selected folder (based on the recursive configuration). The message will not be shown if files were found but none of them was a text file, resulting in no files open at all.

## 0.0.2 - 2018-08-31
Added some metadata.

## 0.0.1 - 2018-08-20
Initial release.
