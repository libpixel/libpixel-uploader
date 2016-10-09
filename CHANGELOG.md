# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [2.0.0]
### Added
- Support for custom extensions to be accepted by the uploader.
### Changed
- `LibPixelUploader.messages` object can only be modified, not reassigned.
- `upload()` may be called again after an upload successfully finishes.
- `LibPixelUploader.messages.invalidExtension` default message has been changed.

## [1.1.1] - 2016-10-04
### Fixed
- Fix issues when used as an npm module by using relative paths internally.

## [1.1.0] - 2016-02-03
### Added
- Uploaded files have the Content-Type set automatically in S3.

## [1.0.0] - 2016-01-22
### Added
- Initial release.
