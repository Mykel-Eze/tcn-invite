# PRODUCT REQUIREMENTS DOCUMENT

### Campus Invitation & Attendance System

**Version:** 1.
**Date:** March 2025

## 1. Overview

The system enables users to send personalized invitations to first-time guests for weekly Sunday Church
Services hosted across multiple Campuses. Guests receive a customized digital flyer containing a unique
QR code used for Pastoral Care Unit (PCU) check-in. Campus and HQ administrators can track
invitations and attendance in real time.

## 2. Objectives

```
● Increase first-time guest attendance through personalized digital invitations.
● Simplify the invitation workflow for members.
● Provide real-time visibility into invite-to-attendance conversion.
● Enhance guest experience through a structured PCU flow.
```
## 3. Key Metrics

```
● Invite-to-attendance conversion rate.
● QR code scan rate.
● Delivery success rate across channels.
● Number of invitations sent per week.
```
## 4. Core User Roles

```
● Inviter (Member) : Creates and sends invitations.
● Guest : Receives flyer and attends event.
```

```
● PCU Host : Scans QR codes and verifies attendance.
● Campus Ops Manager : Views Campus-level dashboard.
● Central HQ : Views aggregated metrics across all Campuss.
```
## 5. End-to-End Flow

1. **Inviter fills out the guest form**
    ○ Guest name, phone number, inviter name, guest location, preferred channel.
2. **Inviter selects the closest Campus**
    ○ Manual selection from a predefined list of Campuss in one country.
3. **System generates 3 personalized flyers**
    ○ Each includes guest name, Campus address, event time, and a unique QR code.
4. **Inviter selects one flyer design**
5. **Inviter chooses delivery method**
    ○ WhatsApp, Telegram, SMS, Email, or file download.
6. **Guest receives flyer and attends event**
7. **Compere welcomes the guest and directs them to the PCU room**
8. **PCU Host scans the unique QR code using a smartphone**
9. **System verifies attendance**
    ○ Identity confirmed
    ○ Opt-in recorded
    ○ Attendance logged in real time
10. **Inviter receives an immediate notification**
    ○ Notification is sent through the same channel used to deliver the flyer (where possible).
    ○ If unavailable, notification status is tracked in the dashboard.
11. **Guest receives the PCU experience**
    ○ Free drink
    ○ Access to exclusive digital content
12. **Campus Ops Managers and HQ see real-time attendance data in their dashboards**

## 6. Functional Requirements

### 6.1 Invitation Form

```
● Guest name (required)
● Guest phone number (required)
● Email (optional)
● Location input
● Inviter name
● Preferred communication channel
```

```
● Data retention: 90–180 days
```
### 6.2 Campus Selection

```
● List of preconfigured Campuses within one country
● Inviter selects manually
● Linked to recurring Sunday event
```
### 6.3 Flyer Generation

```
● 3 designs generated per guest
● Hybrid templated + AI visual system
● Flyer includes:
○ Guest name
○ Campus address
○ Event time (preconfigured)
○ Unique QR code
○ Incentive text
● QR code stores guest-specific ID for scanning only
● Option to regenerate designs once
```
### 6.4 Delivery Channels

```
● Built-in integrations: WhatsApp, Telegram, SMS, Email
● Fallback: download PDF/PNG/JPEG
● WhatsApp Business API TBD
```
### 6.5 Check-In Process

```
● QR code scanned by PCU host using smartphone
● System validates guest and captures consent
● Manual lookup available for guests without flyers
```
### 6.6 Exclusive Content

```
● Digital format
● No delivery mechanism needed in v
```
### 6.7 Dashboard


```
● Real-time data
● View per guest:
○ Sent status
○ Delivery method
○ Delivery success
○ Check-in status
○ Timestamps
● Access: Campus Ops Managers (Campus-only) and HQ (global)
● Filters: Campus, inviter, date

```
## 8. Edge Cases

```
● Guest forgets flyer → manual lookup
● Wrong Campus selected → redirected at PCU room
● Duplicate invites detected by phone number
● QR screenshot accepted
```

## 9. Exclusions (v1)

```
● Multi-country events
● Landing pages behind QR codes
● Bulk invitations
● Multiple events per week
● Automated delivery of digital content
● WhatsApp Business API template configuration
● Seating or table allocation
● Guest RSVP workflow
```
## 10. Future Enhancements

```
● Automated Campus recommendations
● Bulk CSV uploads
● Gamified inviter rewards
● Seasonal flyer variations
● Exclusive content delivery automation
● WhatsApp Business API integration
● Advanced analytics and reporting
```

