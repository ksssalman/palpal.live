import 'dart:async';
import 'package:flutter/material.dart';

void main() {
  runApp(const WorkTrackerApp());
}

class WorkTrackerApp extends StatelessWidget {
  const WorkTrackerApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Work Tracker',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        scaffoldBackgroundColor: const Color(0xFF334155),
        textTheme: const TextTheme(
          bodyLarge: TextStyle(color: Colors.white, fontFamily: 'Arial'),
          bodyMedium: TextStyle(color: Colors.white, fontFamily: 'Arial'),
        ),
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFF9333EA), // Purple 600
          secondary: Color(0xFF10B981), // Emerald 500
          surface: Color(0xFF1E293B), // Slate 800
        ),
      ),
      home: const WorkTrackerHome(),
    );
  }
}

class WorkTrackerHome extends StatefulWidget {
  const WorkTrackerHome({super.key});

  @override
  State<WorkTrackerHome> createState() => _WorkTrackerHomeState();
}

class _WorkTrackerHomeState extends State<WorkTrackerHome> {
  bool _isClockedIn = false;
  DateTime? _clockInTime;
  Timer? _timer;
  String _currentDuration = "00:00:00";

  final TextEditingController _tagController = TextEditingController();
  final List<String> _currentTags = [];

  final List<Map<String, dynamic>> _recentSessions = [
    {
      'id': 1,
      'isManual': false,
      'clockIn': DateTime.now().subtract(const Duration(hours: 2, minutes: 15)),
      'clockOut': DateTime.now(),
      'tags': ['Development'],
    },
    {
      'id': 2,
      'isManual': false,
      'clockIn': DateTime.now().subtract(const Duration(days: 1, hours: 3)),
      'clockOut': DateTime.now().subtract(const Duration(days: 1, hours: 2, minutes: 15)),
      'tags': ['Design Review', 'Meeting'],
    }
  ];

  @override
  void initState() {
    super.initState();
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_isClockedIn && _clockInTime != null) {
        setState(() {
          _currentDuration = _calculateDuration(_clockInTime!, DateTime.now());
        });
      }
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    _tagController.dispose();
    super.dispose();
  }

  String _formatTime(DateTime time) {
    String h = time.hour > 12 ? (time.hour - 12).toString() : (time.hour == 0 ? "12" : time.hour.toString());
    String m = time.minute.toString().padLeft(2, '0');
    String p = time.hour >= 12 ? "PM" : "AM";
    return "$h:$m $p";
  }

  String _formatDate(DateTime date) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return "${months[date.month - 1]} ${date.day}";
  }

  String _calculateDuration(DateTime start, DateTime? end) {
    if (end == null) return "0s";
    Duration diff = end.difference(start);
    if (diff.inHours > 0) {
      return "${diff.inHours}h ${(diff.inMinutes % 60)}m";
    } else if (diff.inMinutes > 0) {
      return "${diff.inMinutes}m ${(diff.inSeconds % 60)}s";
    }
    return "${diff.inSeconds}s";
  }

  void _clockIn() {
    setState(() {
      _isClockedIn = true;
      _clockInTime = DateTime.now();

      final tagText = _tagController.text.trim();
      if (tagText.isNotEmpty) {
        _currentTags.addAll(tagText.split(',').map((t) => t.trim()).where((t) => t.isNotEmpty));
      }
      _tagController.clear();
    });
  }

  void _clockOut() {
    setState(() {
      _recentSessions.insert(0, {
        'id': DateTime.now().millisecondsSinceEpoch,
        'isManual': false,
        'clockIn': _clockInTime,
        'clockOut': DateTime.now(),
        'tags': List<String>.from(_currentTags),
      });
      _isClockedIn = false;
      _clockInTime = null;
      _currentTags.clear();
      _currentDuration = "00:00:00";
    });
  }

  void _addTag() {
    final tagText = _tagController.text.trim();
    if (tagText.isNotEmpty) {
      setState(() {
        _currentTags.addAll(tagText.split(',').map((t) => t.trim()).where((t) => t.isNotEmpty && !_currentTags.contains(t)));
        _tagController.clear();
      });
    }
  }

  void _removeTag(String tag) {
    setState(() {
      _currentTags.remove(tag);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 24.0),
          child: Container(
            constraints: const BoxConstraints(maxWidth: 900),
            padding: const EdgeInsets.all(24.0),
            decoration: BoxDecoration(
              color: const Color(0xFF23263A), // bg-white/80 translated to the dark blue from css
              borderRadius: BorderRadius.circular(24),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.12),
                  blurRadius: 32,
                  offset: const Offset(0, 4),
                )
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                _buildHeader(),
                const SizedBox(height: 32),
                _buildClockInSection(),
                const SizedBox(height: 32),
                _buildRecentSessions(),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Row(
          children: [
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                color: const Color(0xFFF3E8FF), // Purple 100
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Icon(Icons.timer, color: Color(0xFF9333EA)), // Purple 600
            ),
            const SizedBox(width: 12),
            const Text(
              'Work Tracker',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: Colors.white,
                letterSpacing: -0.5,
              ),
            ),
          ],
        ),
        Row(
          children: [
            IconButton(
              icon: const Icon(Icons.download, color: Color(0xFF64748B)),
              onPressed: () {},
            ),
            IconButton(
              icon: const Icon(Icons.delete_outline, color: Color(0xFF64748B)),
              onPressed: () {},
            ),
            IconButton(
              icon: const Icon(Icons.settings, color: Color(0xFF64748B)),
              onPressed: () {},
            ),
            IconButton(
              icon: const Icon(Icons.logout, color: Color(0xFFEF4444)),
              onPressed: () {},
            ),
          ],
        )
      ],
    );
  }

  Widget _buildClockInSection() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B), // Slate 800
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFF334155)), // Slate 700
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 10,
            offset: const Offset(0, 4),
          )
        ],
      ),
      child: !_isClockedIn ? _buildReadyState() : _buildActiveState(),
    );
  }

  Widget _buildReadyState() {
    return ElevatedButton(
      onPressed: _clockIn,
      style: ElevatedButton.styleFrom(
        padding: const EdgeInsets.symmetric(vertical: 16),
        backgroundColor: Colors.transparent, // Background handled by Container
        shadowColor: Colors.transparent,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      ).copyWith(
        backgroundColor: WidgetStateProperty.resolveWith((states) {
          return null; // Let the gradient show through
        }),
      ),
      child: Ink(
        decoration: BoxDecoration(
          gradient: const LinearGradient(
            colors: [Color(0xFF22C55E), Color(0xFF10B981)], // Green to Emerald
          ),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Container(
          alignment: Alignment.center,
          padding: const EdgeInsets.symmetric(vertical: 16),
          child: const Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.play_circle_fill, color: Colors.white),
              SizedBox(width: 8),
              Text(
                'Clock In',
                style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildActiveState() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        // Active Session Header
        Container(
          decoration: BoxDecoration(
            color: const Color(0xFF0F172A).withOpacity(0.5), // Slate 900
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: const Color(0xFF334155).withOpacity(0.5)),
          ),
          child: Column(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
                decoration: BoxDecoration(
                  border: Border(bottom: BorderSide(color: const Color(0xFF334155).withOpacity(0.5))),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('ACTIVE SESSION', style: TextStyle(color: Color(0xFF64748B), fontSize: 12, fontWeight: FontWeight.bold)), // Slate 500
                    Text(_formatTime(DateTime.now()), style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 12)), // Slate 400
                  ],
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  children: [
                    const Text('STARTED AT', style: TextStyle(color: Color(0xFF34D399), fontSize: 12, fontWeight: FontWeight.bold)), // Emerald 400
                    const SizedBox(height: 8),
                    Text(_formatTime(_clockInTime!), style: const TextStyle(color: Color(0xFF34D399), fontSize: 32, fontWeight: FontWeight.w900)),
                    Text(_formatDate(_clockInTime!), style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 12)),
                    const SizedBox(height: 24),
                    const Text('DURATION', style: TextStyle(color: Color(0xFFC084FC), fontSize: 12, fontWeight: FontWeight.bold)), // Purple 400
                    const SizedBox(height: 8),
                    Text(_currentDuration, style: const TextStyle(color: Color(0xFFC084FC), fontSize: 32, fontWeight: FontWeight.w900)),
                    const Text('running', style: TextStyle(color: Color(0xFFD8B4FE), fontSize: 12)), // Purple 300
                  ],
                ),
              ),
            ],
          ),
        ),

        const SizedBox(height: 24),

        // Tags Section
        const Row(
          children: [
            Icon(Icons.local_offer, color: Color(0xFFCBD5E1), size: 16),
            SizedBox(width: 8),
            Text('Tags', style: TextStyle(color: Color(0xFFCBD5E1), fontSize: 14, fontWeight: FontWeight.bold)),
          ],
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(
              child: TextField(
                controller: _tagController,
                style: const TextStyle(color: Colors.white, fontSize: 14),
                decoration: InputDecoration(
                  hintText: 'Add a tag...',
                  hintStyle: const TextStyle(color: Color(0xFF94A3B8)),
                  filled: true,
                  fillColor: const Color(0xFF334155), // Slate 700
                  contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                    borderSide: const BorderSide(color: Color(0xFF475569)), // Slate 600
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                    borderSide: const BorderSide(color: Color(0xFF475569)),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                    borderSide: const BorderSide(color: Color(0xFF9333EA)), // Purple 600
                  ),
                ),
                onSubmitted: (_) => _addTag(),
              ),
            ),
            const SizedBox(width: 8),
            InkWell(
              onTap: _addTag,
              child: Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: const Color(0xFF9333EA),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Icon(Icons.add, color: Colors.white),
              ),
            )
          ],
        ),
        const SizedBox(height: 12),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: _currentTags.isEmpty ? [const Text('No tags added yet', style: TextStyle(color: Color(0xFF64748B), fontStyle: FontStyle.italic, fontSize: 14))] :
          _currentTags.map((tag) => Container(
            padding: const EdgeInsets.only(left: 12, right: 4, top: 4, bottom: 4),
            decoration: BoxDecoration(
              color: const Color(0xFF581C87).withOpacity(0.4), // Purple 900
              border: Border.all(color: const Color(0xFFA855F7).withOpacity(0.2)), // Purple 500
              borderRadius: BorderRadius.circular(16),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.local_offer, color: Color(0xFFC084FC), size: 12),
                const SizedBox(width: 4),
                Text(tag, style: const TextStyle(color: Color(0xFFE9D5FF), fontSize: 14, fontWeight: FontWeight.w500)), // Purple 200
                const SizedBox(width: 8),
                Container(width: 1, height: 12, color: const Color(0xFFA855F7).withOpacity(0.2)),
                const SizedBox(width: 4),
                InkWell(
                  onTap: () => _removeTag(tag),
                  child: const Padding(
                    padding: EdgeInsets.all(2.0),
                    child: Icon(Icons.close, color: Color(0xFF94A3B8), size: 14),
                  ),
                )
              ],
            ),
          )).toList(),
        ),

        const SizedBox(height: 24),

        ElevatedButton(
          onPressed: _clockOut,
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFF334155), // Slate 700
            foregroundColor: Colors.white,
            padding: const EdgeInsets.symmetric(vertical: 16),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
              side: const BorderSide(color: Color(0xFF475569)),
            ),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(width: 12, height: 12, decoration: BoxDecoration(color: const Color(0xFFEF4444), borderRadius: BorderRadius.circular(2))),
              const SizedBox(width: 8),
              const Text('Clock Out', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildRecentSessions() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Row(
          children: [
            Icon(Icons.calendar_today, color: Colors.white, size: 20),
            SizedBox(width: 8),
            Text('Recent Sessions', style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
          ],
        ),
        const SizedBox(height: 16),
        ..._recentSessions.map((session) => Container(
          margin: const EdgeInsets.only(bottom: 12),
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: const Color(0xFF1E293B), // Slate 800
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: const Color(0xFF334155)), // Slate 700
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(_formatDate(session['clockIn']), style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 14)),
                  Row(
                    children: [
                      Text(
                        _calculateDuration(session['clockIn'], session['clockOut']),
                        style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14),
                      ),
                      const SizedBox(width: 8),
                      Container(
                        padding: const EdgeInsets.all(4),
                        decoration: BoxDecoration(color: const Color(0xFF9333EA), borderRadius: BorderRadius.circular(4)), // Purple 600
                        child: const Icon(Icons.edit, color: Colors.white, size: 14),
                      ),
                      const SizedBox(width: 8),
                      Container(
                        padding: const EdgeInsets.all(4),
                        decoration: BoxDecoration(color: const Color(0xFFEF4444).withOpacity(0.2), borderRadius: BorderRadius.circular(4)),
                        child: const Icon(Icons.delete, color: Color(0xFFF87171), size: 14), // Red 400
                      ),
                    ],
                  )
                ],
              ),
              const SizedBox(height: 4),
              Text(
                '${_formatTime(session['clockIn'])} - ${_formatTime(session['clockOut'])}',
                style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 18),
              ),
              const SizedBox(height: 8),
              Wrap(
                spacing: 4,
                runSpacing: 4,
                children: (session['tags'] as List<String>).map((tag) => Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: const Color(0xFF334155), // Slate 700
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: Text(tag, style: const TextStyle(color: Color(0xFFCBD5E1), fontSize: 12, fontWeight: FontWeight.w500)), // Slate 300
                )).toList(),
              )
            ],
          ),
        )),
      ],
    );
  }
}
